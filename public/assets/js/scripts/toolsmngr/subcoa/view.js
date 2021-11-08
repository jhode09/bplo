'use strict';
var table;
var ID;
// Class definition

//Adding Class of Nav to become active
menuActive('li-menu-tools', 'li-submenu-tools-subcoa', 'li-lastmenu-tools-subcoa-view');

//Show Edit Modal
var KTEditDetails = function(id) {
    ID = id;
    $.ajax({
        url : fetch_subcoa_single_url,
        type: "POST",
        data: {"id": id},
        success:function(res) {
            if(res != "not_found") {
                $("input[name='subAcctTitle']").val(res.subAcctTitle);
                $("select[name='chartOfAcct']").val(res.chartOfAcct).selectpicker('refresh');
                $("input[name='amount']").val(parseInt(res.amount));
                $("#editModal").modal('show');
            } else {
                forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
            } 
        },
        error:function(a, b, c) {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    }) 
}

//Move to trash
var KTChangeStatus = function(id, status) {
    Swal.fire({
        title: "Are you sure?",
        text: "You want to change the status of this?!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, please!",
        cancelButtonText: "No, cancel!",
        customClass: {
           confirmButton: "btn btn-danger mt-0"
        },
        reverseButtons: true
    }).then(function(result) {
        if (result.value) {
            $.ajax({
                url : change_statussub_url,
                type: "post",
                data: { "id": id, "status" : status },
                beforeSend: function() {
                    _beforeSend();
                },
                xhr: function() {
                    return _xhr();
                },
                complete: function() {
                    _complete();
                },
                success: function(res) {
                    if(res == "success") {
                        table.ajax.reload();
                        forSwal("Status has been updated.", "success", "btn-success");
                    } else {
                        forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                    }
                },
                error:function(a, b, c) {
                    forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                }
            });
        }
    });
}

//Move to trash
var KTArchive = function(id) {
    Swal.fire({
        title: "Are you sure?",
        text: "You want to Archive this?!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, move it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
    }).then(function(result) {
        if (result.value) {
            $.ajax({
                url : change_statussub_url,
                type: "post",
                data: { "id": id, "status" : 3 },
                beforeSend: function() {
                    _beforeSend();
                },
                xhr: function() {
                    return _xhr();
                },
                complete: function() {
                    _complete();
                },
                success: function(res) {
                    if(res == "success") {
                        table.ajax.reload();
                        forSwal("Chart of Account has been archived.", "success", "btn-success");
                    } else {
                        forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                    }
                },
                error:function(a, b, c) {
                    forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                }
            });
        }
    });
}

var KTViewSubCoa = function() {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $("input[name='amount']").inputmask({
        "mask": "9",
        "repeat": 10,
        "greedy": false
    });

    $("#cboStatus").change(function(){
        var val = $(this).val();
        table.column(7).search($(this).val(), false, false).draw(); 
    });

    // basic demo
    var _loadTable = function() {
        if( table ) { 
            table.clear();
            table.destroy(); 
        }

        table = $('#tbl_chartofacc_sub').DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            language: {                
                infoFiltered: ""
            },
            ajax: {
                method : "POST",
                url    : fetch_subcoa_url,
                data: {
                    columnsDef: [
                        'DT_RowIndex', 
                        'AcctCode', 
                        'AcctTitle',
                        'SubAcctTitle', 
                        'CreatedAt', 
                        'CreatedBy', 
                        'Status', 
                        'Action',

                    ],
                },
            },
            columns: [
                {data: 'DT_RowIndex'},
                {data: 'AcctCode'},
                {data: 'AcctTitle'},
                {data: 'SubAcctTitle'},
                {data: 'CreatedAt'},
                {data: 'UpdatedAt'},
                {data: 'CreatedBy'},
                {data: 'Status'},
                {data: 'Action', orderable: false, searchable:false},
            ],
            columnDefs: [
                //AcctTitle
                {
                    targets: 2,
                    width: 150
                },
                //SubAcctTitle
                {
                    targets: 3,
                    width: 150
                },
                //Status
                {   
                    targets: 7,
                    render: function( data, type, row ) {
                        var status = {
                            1: {'title': 'Active',   'state': 'success'},
                            2: {'title': 'Inactive', 'state': 'danger'},
                        };
                        return '<span class="label label-' + status[row.Status].state + ' label-dot mr-2"></span><span class="font-weight-bold text-' + status[row.Status].state +
                            '">' +
                            status[row.Status].title + '</span>';
                    }
                }
            ]
        });
    };

    var _handleUpdateForm = function() {
        var validation;

        validation = FormValidation.formValidation(
            KTUtil.getById('form-subcoa-update'),
            {
                fields: {
                    chartOfAcct: {
                        validators: {
                            notEmpty: {
                                message: 'Chart of Account is required'
                            }
                        }
                    },
                    subAcctTitle: {
                        validators: {
                            notEmpty: {
                                message: 'Sub Account Title is required'
                            },
                            stringLength: {
                                max:45,
                                message: 'Maximum of 45 characters only'
                            }
                        }
                    },
                    amount: {
                        validators: {
                            notEmpty: {
                                message: 'Amount is required'
                            }
                        }
                    },
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    submitButton: new FormValidation.plugins.SubmitButton(),
                    //defaultSubmit: new FormValidation.plugins.DefaultSubmit(), // Uncomment this line to enable normal button submit after form validation
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }
            }
        );

        $("#btn_submit").on('click', function(e) {
            e.preventDefault();

            validation.validate().then(function(status) {
                if (status == 'Valid') 
                {
                    Swal.fire({
                        title: "Are you sure?",
                        text: "You want to update this?!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes, update it!",
                        cancelButtonText: "No, cancel!",
                        customClass: {
                           confirmButton: "btn btn-success mt-0"
                        },
                        reverseButtons: true
                    }).then(function(result) {
                        if (result.value) {
                            var fd = new FormData($("#form-subcoa-update")[0]);
                            fd.append('id', ID);
                            $.ajax({
                                url : update_subcoa_url,
                                data: fd,
                                processData: false,
                                contentType: false,
                                type: "POST",
                                beforeSend: function() {
                                    _beforeSend();
                                },
                                xhr: function() {
                                    return _xhr();
                                },
                                complete: function() {
                                    _complete();
                                },
                                success:function(res)
                                {
                                    if(res == 'success') {
                                        forSwal("Successfully Updated", "success", "btn-success");
                                        $("#editModal").modal('hide');
                                        $("select[name='chartOfAcct']").val('').selectpicker('refresh');
                                        table.ajax.reload();
                                    } 
                                    else if (res == 'exists') {
                                        forSwal("This entry is already exists.", "error", "btn-danger");
                                    }
                                    else {
                                        forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                                    }
                                },
                                error:function(a,b,c)
                                {
                                    forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                                }
                            });
                        }
                    });
                }
                else 
                {
                    forSwal("Sorry, looks like there are some errors detected, please try again.", 
                                    "error", "btn-danger");
                }
            });
        })
    };

    return {
        // public functions
        init: function() {
            _loadTable();
            _handleUpdateForm();
            $("#cboStatus").selectpicker();
        },
    };
}();

jQuery(document).ready(function() {
    KTViewSubCoa.init();
});
