"use strict";
var ID;

//Adding Class of Nav to become active
menuActive('li-menu-tools', 'li-submenu-tools-subcoa', 'li-lastmenu-tools-subcoa-edit');

var KTEditSubCoa = function () {

    //Setting up ajax for laravel
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    // Private functions
    var _onLoad = function() {
        _disableForm(true);

        $("input[name='amount']").inputmask({
            "mask": "9",
            "repeat": 10,
            "greedy": false
        });
    };

    //Setting up validation in Form
    var _handleUpdateForm = function() {
        var validation;

        validation = FormValidation.formValidation(
            KTUtil.getById('form-subcoa-update'),
            {
                fields: {
                    subAcct: {
                        validators: {
                            notEmpty: {
                                message: 'Sub account is required'
                            }
                        }
                    },
                    subAcctTitle: {
                        validators: {
                            notEmpty: {
                                message: 'Sub Account Title is required'
                            },
                            stringLength: {
                                max:150,
                                message: 'Maximum of 150 characters only'
                            }
                        }
                    },
                    chartOfAcct: {
                        validators: {
                            notEmpty: {
                                message: 'Chart of Account is required'
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
                    acctCode: {
                        validators: {
                            notEmpty: {
                                message: 'Account code is required'
                            }
                        }
                    },
                    acctTitle: {
                        validators: {
                            notEmpty: {
                                message: 'Account title is required'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    submitButton: new FormValidation.plugins.SubmitButton(),
                    //defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }
            }
        );

        //Save Sanguniang Panglungsod Resolution
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
                            var fd = new FormData($("#form-subcoa-update    ")[0]);
                            fd.append("id", ID);
                            $.ajax({
                                url : update_subcoa_url,
                                data: fd,
                                processData: false,
                                contentType: false,
                                type: "POST",
                                beforeSend: function() {
                                    _beforeSend();
                                    _disableButton(true);
                                },
                                xhr: function() {
                                    return _xhr();
                                },
                                complete: function(xhr) {
                                    _complete();
                                    _disableButton(false);
                                },
                                success:function(res)
                                {
                                    if(res == 'success') {
                                        forSwal("Successfully Saved", "success", "btn-success");
                                        _disableForm(true);
                                        _updateCbo();
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

    //Disable Button
    var _disableButton = function(bool) {
        $("#btn_submit").prop('disabled', bool);
        $("#btn_cancel").prop('disabled', bool);
    };

    //Disable Form
    var _disableForm = function(bool) {
        if( bool ) {
            $("#form-subcoa-update  ")[0].reset();
            $("select[name='subAcct']").val('').selectpicker("refresh");
            $("select[name='chartOfAcct']").val('').selectpicker("refresh");
        }

        $("input[name='subAcctTitle']").prop('disabled', bool);
        $("input[name='amount']").prop('disabled', bool);
        $("select[name='chartOfAcct']").attr('disabled', bool).selectpicker('refresh');
    }

    //Update CBO
    var _updateCbo = function() {
        $.ajax({
            url : fetch_cbo_val_sub_url,
            type: "post",
            success: function(res)
            {   
                var option = "";
                $("select[name='subAcct']").empty();
                option += '<option value="" class="text-muted">Select Sub Account</option>';
                for (var i = 0; i < res.length; i++) {
                    option += '<option value="'+res[i].id+'">'+res[i].subacct_title+'</option>'
                }
                $("select[name='subAcct']").append(option);
                $('.selectpicker').selectpicker('refresh');
            }

        })
    }

    $("select[name='chartOfAcct']").on('change', function(){
        if($(this).val() != "") {
            $.ajax({
                url : fetch_coa_details_url,
                type: "POST",
                data: { "id" : $(this).val() },
                success:function(res) {
                    if(!res) {
                        forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                    } else {
                        $("input[name='acctCode']").val(res.acctCode);
                        $("input[name='acctTitle']").val(res.acctTitle);
                    } 
                }, error : function(a, b, c) {
                    forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                }
            })
        } else {
            $("input[name='acctCode']").val('');
            $("input[name='acctTitle']").val('');
        }
    });

    $("select[name='subAcct']").on('change', function(){
        ID = $(this).val();
        if($(this).val() != "") {
            $.ajax({
                url : fetch_subcoa_single_url,
                type: "POST",
                data: { "id" : $(this).val() },
                success:function(res) {
                    if(!res) {
                        forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                    } else {
                        $("select[name='chartOfAcct']").val(res.chartOfAcct);
                        $("input[name='subAcctTitle']").val(res.subAcctTitle);
                        $("input[name='amount']").val(parseInt(res.amount));
                        $("input[name='acctCode']").val(res.acctCode);
                        $("input[name='acctTitle']").val(res.acctTitle);
                        _disableForm(false);
                    } 
                }, error : function(a, b, c) {
                    forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                }
            })
        } else {
            _disableForm(true);
        }
    });
    
    $("#btn_cancel").click(function(){
        _disableForm(true);
    });


    return {
        // public functions
        init: function() {
            _onLoad();
            _handleUpdateForm();
            $("input[name='acctCode']").prop('disabled', true);
            $("input[name='acctTitle']").prop('disabled', true);
        }
    };

}();

// Initialization
jQuery(document).ready(function() {
    KTEditSubCoa.init();
});