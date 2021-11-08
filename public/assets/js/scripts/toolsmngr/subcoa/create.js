"use strict";
// Class definition

//Adding Class of Nav to become active
menuActive('li-menu-tools', 'li-submenu-tools-subcoa', 'li-lastmenu-tools-subcoa-add');

var KTCreateSubCoa = function () {

    //Setting up ajax for laravel
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    // Private functions
    var _onLoad = function() {
        $("input[name='acctCode']").focus();

        // repeating mask
        $("input[name='amount']").inputmask({
            "mask": "9",
            "repeat": 10,
            "greedy": false
        });
    };

    //Setting up validation in Form
    var _handleCreateForm = function() {
        var validation;

        validation = FormValidation.formValidation(
            KTUtil.getById('form-subcoa-create'),
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
                                max:150,
                                message: 'Maximum of 150 characters only'
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

        //Save Sanguniang Panglungsod Resolution
        $("#btn_submit").on('click', function(e) {
            e.preventDefault();

            validation.validate().then(function(status) {
                if (status == 'Valid') 
                {
                    var fd = new FormData($("#form-subcoa-create")[0]);
                    $.ajax({
                        url : create_subcoa_url,
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
                else 
                {
                    forSwal("Sorry, looks like there are some errors detected, please try again.", 
                                    "error", "btn-danger");
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
        $("#form-subcoa-create")[0].reset();
        $("select[name='chartOfAcct']").val('').selectpicker('refresh');
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
    KTCreateSubCoa.init();
});