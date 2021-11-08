"use strict";
// Class definition

//Adding Class of Nav to become active
menuActive('li-menu-tools', 'li-submenu-tools-coa', 'li-lastmenu-tools-coa-add');

var KTCreateCoa = function () {

    //Setting up ajax for laravel
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    // Private functions
    var _onLoad = function() {
        $("input[name='acctCode']").focus();
    };

    //Setting up validation in Form
    var _handleCreateForm = function() {
        var validation;

        validation = FormValidation.formValidation(
            KTUtil.getById('form-coa-create'),
            {
                fields: {
                    acctCode: {
                        validators: {
                            notEmpty: {
                                message: 'Account code is required'
                            },
                            stringLength: {
                                max:30,
                                message: 'Maximum of 30 characters only'
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
                    var fd = new FormData($("#form-coa-create")[0]);
                    $.ajax({
                        url : create_coa_url,
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
                                forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
                            }
                        },
                        error:function(a,b,c)
                        {
                            forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
                        }
                    });
                }
                else 
                {
                    forSwal("Sorry, looks like there are some errors detected, please try again.", "error", "btn-danger");
                }
            });
        })
    };

    //Setting up validation in Form
    var _handleImportForm = function() {
        var validation;

        validation = FormValidation.formValidation(
            KTUtil.getById('form-import'),
            {
                fields: {
                    file: {
                        validators: {
                            notEmpty: {
                                message: 'Please select a file.'
                            },
                        }
                    },
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    submitButton: new FormValidation.plugins.SubmitButton(),
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }
            }
        );

        //Save Sanguniang Panglungsod Resolution
        $("#btn_import").on('click', function(e) {
            e.preventDefault();

            validation.validate().then(function(status) {
                if (status == 'Valid') 
                {
                    var fd = new FormData($("#form-import")[0]);
                    $.ajax({
                        url : import_file_url,
                        data: fd,
                        processData: false,
                        contentType: false,
                        type: "POST",
                        beforeSend: function() {
                            _beforeSend();
                            $("#btn_import").prop('disabled', true);
                        },
                        xhr: function() {
                            return _xhr();
                        },
                        complete: function(xhr) {
                            _complete();
                            $("#btn_import").prop('disabled', false);
                            $(".custom-file-label").html('Choose excel file');
                            $("#importModal").modal('hide');
                        },
                        success:function(res)
                        {
                            if(res == 'success') {
                                $("#form-import")[0].reset();
                                forSwal("Excel file has been successfully imported", "success", "btn-success");
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
                else 
                {
                    forSwal("Sorry, looks like there are some errors detected, please try again.", "error", "btn-danger");
                }
            });
        })
    }; 

    //Disable Button
    var _disableButton = function(bool) {
        $("#btn_submit").prop('disabled', bool);
        $("#btn_cancel").prop('disabled', bool);
    };

    //Form Reset
    var _formReset = function() {
        $("#form-coa-create")[0].reset();
    };

    //Cancel
    var _cancel = function() {
        _formReset();
    };



    $("#btn_cancel").click(function(){
        _cancel();
    });


    return {
        // public functions
        init: function() {
            _onLoad();
            _handleCreateForm();
            _handleImportForm();
        }
    };

}();

// Initialization
jQuery(document).ready(function() {
    KTCreateCoa.init();
});