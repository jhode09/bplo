"use strict";
var ID;

//Adding Class of Nav to become active
menuActive('li-menu-tools', 'li-submenu-tools-coa', 'li-lastmenu-tools-coa-edit');

var KTCreateEvent = function () {

    //Setting up ajax for laravel
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    // Private functions
    var _onLoad = function() {
        _disableForm(true);
    };

    //Setting up validation in Form
    var _handleUpdateForm = function() {
        var validation;

        validation = FormValidation.formValidation(
            KTUtil.getById('form-coa-update'),
            {
                fields: {
                    chartOfAcct: {
                        validators: {
                            notEmpty: {
                                message: 'Please select an option.'
                            }
                        }
                    },
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
                    //defaultSubmit: new FormValidation.plugins.DefaultSubmit(), // Uncomment this line to enable normal button submit after form validation
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
                            var fd = new FormData($("#form-coa-update")[0]);
                            fd.append("id", ID);
                            $.ajax({
                                url : update_coa_url,
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
                                        _formReset();
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

    //Disable Button
    var _disableButton = function(bool) {
        $("#btn_submit").prop('disabled', bool);
        $("#btn_cancel").prop('disabled', bool);
    };

    //Disable Form
    var _disableForm = function(bool) {
        if (bool) {
            $("input[name='acctCode']").val('');
            $("input[name='acctTitle']").val('');
            $("select[name='acctGroup']").val('');
            $("select[name='acctClass']").val('');
            $("select[name='revClass']").val('');
            $("select[name='revGroup']").val('');
            $("select[name='budgetSource']").val('');
            $("select[name='revType']").val('');
            $("select[name='revNonTaxType']").val('');
        }

        $("input[name='acctCode']").prop('disabled', bool);
        $("input[name='acctTitle']").prop('disabled', bool);
        $("select[name='acctGroup']").prop('disabled', bool);
        $("select[name='acctClass']").prop('disabled', bool);
        $("select[name='revClass']").prop('disabled', bool);
        $("select[name='revGroup']").prop('disabled', bool);
        $("select[name='budgetSource']").prop('disabled', bool);
        $("select[name='revType']").prop('disabled', bool);
        $("select[name='revNonTaxType']").prop('disabled', bool);
        $("#btn_submit").prop('disabled', bool);
    }

    //Form Reset
    var _formReset = function() {
        $("#form-coa-update")[0].reset();
    };

    //Cancel
    var _cancel = function() {
        _formReset();
        _disableForm(true);
        $("select[name='chartOfAcct']").removeClass('is-valid');
        $("select[name='chartOfAcct']").removeClass('is-invalid');
        $("select[name='chartOfAcct']").val('').selectpicker('refresh');
    };

    var _updateCbo = function() {
        $.ajax({
            url : fetch_cbo_val_url,
            type: "post",
            success: function(res)
            {   
                var option = "";
                $("select[name='chartOfAcct']").empty();
                option += '<option value="" class="text-muted">Select Chart of Account</option>';
                for (var i = 0; i < res.length; i++) {
                    option += '<option value="'+res[i].id+'">'+res[i].acct_code + '&emsp; - &emsp;' + res[i].acct_title+'</option>'
                }
                $("select[name='chartOfAcct']").append(option).selectpicker('refresh');
            }

        })
    }

    $("select[name='chartOfAcct']").on('change', function(){
        ID = $(this).val();
        if($(this).val() != "") {
            $.ajax({
                url : fetch_coa_single_url,
                type: "POST",
                data: { "id": $(this).val() },
                success:function(res) {
                    if(!res) {
                        forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                    } else {
                        $("input[name='acctCode']").val(res.acctCode);
                        $("input[name='acctTitle']").val(res.acctTitle);
                        $("select[name='acctGroup']").val(res.acctGroupID);
                        $("select[name='acctClass']").val(res.acctClassID);
                        $("select[name='revClass']").val(res.revClass);
                        $("select[name='revGroup']").val(res.revGroup);
                        $("select[name='budgetSource']").val(res.budgetSource);
                        $("select[name='revType']").val(res.revType);
                        $("select[name='revNonTaxType']").val(res.revNonTaxType);
                        _disableForm(false);
                    } 
                }, error : function(a, b, c) {
                    forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                }
            })
        } else {
            _disableForm(true);
        }
    })
    
    $("#btn_cancel").click(function(){
        _cancel();
    });


    return {
        // public functions
        init: function() {
            _onLoad();
            _handleUpdateForm();
        }
    };

}();

// Initialization
jQuery(document).ready(function() {
    KTCreateEvent.init();
});