'use strict';
var table;
var ID;
var ctr = 0;
// Class definition

//Adding Class of Nav to become active
menuActive('li-menu-tools', 'li-submenu-tools-coa', 'li-lastmenu-tools-coa-view');

//View Details
var KTViewDetails = function(revClass, revGroup, budgetSource, revType, revNonTaxType) {
    $("#revClass").text(revClass);
    $("#revGroup").text(revGroup);
    $("#budgetSource").text(budgetSource);
    $("#revType").text(revType);
    $("#revNonTaxType").text(revNonTaxType);
    $("#detailsModal").modal('show');
}

//Show Edit Modal
var KTSubAcct = function(id)
{
    ID = id;
    $.ajax({
        url : fetch_subbacct_url,
        type: "POST",
        data: {"id": id},
        success:function(res) {
            if(res != "not_found") {
                $("#tblSubAcct tbody").empty();
                var data = "";
                var ctr = 1;
                if(res.length > 0) {
                    for(var i = 0; i < res.length; i++) {
                        var status = (res[i].Status == 1) ? "<span class='text-success'>Active</span>":"<span class='text-danger'>Inactive</span>";
                        data += "<tr>";
                        data += "<td>" + ctr++ + "</td>";
                        data += "<td>" + res[i].SubAcctTitle + "</td>";
                        data += "<td>" + status + "</td>";
                        data += "<td>" + res[i].CreatedBy + "</td>";
                        data += "<td>" + res[i].CreatedAt + "</td>";
                        data += "</tr>";
                    }
                } else {
                    data += "<tr>";
                    data += "<td colspan='5'><center><span class='text-danger'>No Sub Account Available</center></td>";
                    data += "</tr>";
                }
                $("#tblSubAcct tbody").append(data);
                $("#subAcctModal").modal('show');
            } else {
                forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
            }
        },
        error: function(a,b,c) {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    }) 
}

//Show Edit Modal
var KTEditDetails = function(id)
{
    ID = id;
    $.ajax({
        url : fetch_coa_single_url,
        type: "POST",
        data: {"id": id},
        success:function(res) {
            if(res != "not_found") {
                $("input[name='acctCode']").val(res.acctCode);
                $("input[name='acctTitle']").val(res.acctTitle);
                $("select[name='acctGroup']").val(res.acctGroupID);
                $("select[name='acctClass']").val(res.acctClassID);
                $("select[name='revClass']").val(res.revClass);
                $("select[name='revGroup']").val(res.revGroup);
                $("select[name='budgetSource']").val(res.budgetSource);
                $("select[name='revType']").val(res.revType);
                $("select[name='revNonTaxType']").val(res.revNonTaxType);
                $("#editModal").modal('show');
            } else {
                forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
            }
        },
        error: function(a,b,c) {
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
                url : change_status_url,
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
                url : change_status_url,
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

var KTViewCoa = function() {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
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

        table = $('#tbl_chartofacc').DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            language: {                
                infoFiltered: ""
            },
            ajax: {
                method : "POST",
                url    : fetch_coa_url,
                data: {
                    columnsDef: [
                        'DT_RowIndex', 
                        'AcctCode', 
                        'AcctTitle',
                        'AcctGroup', 
                        'AcctClass', 
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
                {data: 'AcctGroup'},
                {data: 'AcctClass'},
                {data: 'CreatedAt'},
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
                //Status
                {   
                    targets: 7,
                    title: "Status",
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
            KTUtil.getById('form-coa-update'),
            {
                fields: {
                    acctCode: {
                        validators: {
                            notEmpty: {
                                message: 'Account code is required'
                            },
                            stringLength: {
                                max:30,
                                message: 'Maximum of 50 characters only'
                            }
                        }
                    }, acctTitle: {
                        validators: {
                            notEmpty: {
                                message: 'Account title is required'
                            },
                            stringLength: {
                                max:150,
                                message: 'Maximum of 150 characters only'
                            }
                        }
                    }, acctGroup: {
                        validators: {
                            notEmpty: {
                                message: 'Account group is required. Please select an option.'
                            }
                        }
                    }, acctClass: {
                        validators: {
                            notEmpty: {
                                message: 'Account class is required. Please select an option.'
                            }
                        }
                    }, revClass: {
                        validators: {
                            notEmpty: {
                                message: 'Revenue class is required. Please select an option.'
                            },
                            stringLength: {
                                max:10,
                                message: 'Maximum of 10 characters only'
                            }
                        }
                    }, revGroup: {
                        validators: {
                            notEmpty: {
                                message: 'Revenue group is required. Please select an option.'
                            },
                            stringLength: {
                                max:50,
                                message: 'Maximum of 50 characters only'
                            }
                        }
                    }, budgetSource: {
                        validators: {
                            notEmpty: {
                                message: 'Budget source is required. Please select an option.'
                            },
                            stringLength: {
                                max:50,
                                message: 'Maximum of 50 characters only'
                            }
                        }
                    }, revType: {
                        validators: {
                            notEmpty: {
                                message: 'Revenue type is required. Please select an option.'
                            },
                            stringLength: {
                                max:50,
                                message: 'Maximum of 65 characters only'
                            }
                        }
                    }, revNonTaxType: {
                        validators: {
                            stringLength: {
                                max:70,
                                message: 'Maximum of 65 characters only'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    submitButton: new FormValidation.plugins.SubmitButton(),
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
                            var fd = new FormData($("#form-coa-update")[0]);
                            fd.append('id', ID);
                            $.ajax({
                                url : update_coa_url,
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
                                        table.ajax.reload();
                                    } 
                                    else if (res == 'acctCodeExists') {
                                        forSwal("Account Code is already exists.", "error", "btn-danger");
                                        $("input[name='acctCode']").addClass('is-invalid');
                                    }
                                    else if (res == 'acctTitleExists') {
                                        forSwal("Account Title is already exists.", "error", "btn-danger");
                                        $("input[name='acctTitle']").addClass('is-invalid');
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
    KTViewCoa.init();
});
