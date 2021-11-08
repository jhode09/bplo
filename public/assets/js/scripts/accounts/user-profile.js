"use strict";

$("#side-panel-profile").addClass('text-primary');

// Class definition
var KTUserProfile = function () {

	/***************** BEGIN UTIL ****************/
		$.ajaxSetup({
	        headers: {
	            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
	        }
	    });

        $("#orSeriesNav").click(function(){
            ortype = 1;
            $("#create-tab").click();
            window.history.replaceState(null, null, "?tab=or&menu=create");
        });

        $("#ctcORSeriesNav").click(function(){
            ortype = 2;
            $("#create-tab-ctc").click();
            window.history.replaceState(null, null, "?tab=ctc&menu=create");
        });

		//Get url Parameter
		var _getUrlParameter = function(sParam1, sParam2) {
		    var sPageURL = window.location.search.substring(1),
		        sURLVariables = sPageURL.split('&'),
		        sParameterName,
		        i,
                tab,
		        menu;


		    for (i = 0; i < sURLVariables.length; i++) {
		        sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam1) {
                    tab = sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
                }

		        if (sParameterName[0] === sParam2) {
		            menu = sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
		        }
		    }

            if(tab == "ctc") {
                $("#ctcORSeriesNav").click();
                if(menu == "list") {
                    $("#list-tab-ctc").click();
                } else {
                    $("#create-tab-ctc").click();
                }
            } else {
                $("#orSeriesNav").click();
                if(menu == "list") {
                    $("#list-tab").click();
                } else {
                    $("#create-tab").click();
                }
            }
		    
		};
	/***************** END UTIL ******************/

    /***************** BEGIN CORE ****************/
    	//Disable Button
    	var _disableButton = function(bool) {
    		$("#btn_save_acct").prop('disabled', bool);
    		$("#btn_cancel_acct").prop('disabled', bool);
            $("#btn_save_pass").prop('disabled', bool);
            $("#btn_cancel_pass").prop('disabled', bool);
    	};

        var _displayAcctDetails = function() {
            var name = $("input[name='name']").val();
            var email = $("input[name='email']").val();
            $("input[name='name']").attr('placeholder', name);
            $("input[name='email']").attr('placeholder', email);

            $("#sideBarSymbol, #sidePanelSymbol, #headerSymbol").text(name.charAt(0));
            $("#sideBarName, #sidePanelName, #headerName").text(name);
            $("#sideBarEmail, #sidePanelEmail").text(email);
        }   

        var _handleAcctDetails = function() {
            var validation, validCount = true;

            validation = FormValidation.formValidation(
                KTUtil.getById('form-acct-details'),
                {
                    fields: {
                        name: {
                            validators: {
                                notEmpty: {
                                    message: 'First name is required'
                                },
                                stringLength: {
                                    max:50,
                                    message: 'Maximum of 50 characters only'
                                }
                            }
                        },
                        email: {
                            validators: {
                                notEmpty: {
                                    message: 'Email is required'
                                },
                                stringLength: {
                                    max:150,
                                    message: 'Maximum of 150 characters only'
                                },
                                emailAddress: {
                                    message: 'The value is not a valid email address'
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

            $("#chk").click(function(){
                if ( $(this).is(":checked") ) {
                    $("input[name='email']").val($("input[name='email']").attr("placeholder"));
                } else {
                    $("input[name='email']").val("");
                }
            })

            $("#btn_save_acct").on('click', function(e) {
                e.preventDefault();

                validation.validate().then(function(status) {
                    if (status == 'Valid') 
                    {
                        Swal.fire({
                            title: "Are you sure?",
                            text: "You want to update your account details?!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Yes, please!",
                            cancelButtonText: "No, cancel!",
                            customClass: {
                               confirmButton: "btn btn-success mt-0"
                            },
                            reverseButtons: true
                        }).then(function(result) {
                            if (result.value) {
                                var fd = new FormData($("#form-acct-details")[0]);
                                $.ajax({
                                    url : update_acct_url,
                                    data: fd,
                                    processData: false,
                                    contentType: false,
                                    type: "POST",
                                    beforeSend: function() {
                                        _beforeSend();
                                        _disableButton(true);
                                    },
                                    complete: function(xhr) {
                                        _complete();
                                        _disableButton(false);
                                    },
                                    success:function(res)
                                    {
                                        if(res == 'success') {
                                            _displayAcctDetails();
                                            forSwal("Successfully Updated", "success", "btn-success");
                                            $("#form-acct-details")[0].reset();
                                        } 
                                        else if ( res == "email_exists" ) {
                                            forSwal("Email is already exists.", "error", "btn-danger");
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
                        });
                    }
                    else 
                    {
                        forSwal("Sorry, looks like there are some errors detected, please try again.", "error", "btn-danger");
                    }
                });
            });

            $("#btn_cancel_acct").click(function(){
                validation.resetForm();
                $("#chk").prop('checked', false);
                $("input[name='email']").val("");
            });
        };

        var _handleChangePass = function() {
            var validation, validCount = true;

            validation = FormValidation.formValidation(
                KTUtil.getById('form-change-pass'),
                {
                    fields: {
                        oldpass: {
                            validators: {
                                notEmpty: {
                                    message: 'Old password is required'
                                },
                                stringLength: {
                                    max:50,
                                    message: 'Maximum of 50 characters only'
                                }
                            }
                        },
                        password: {
                            validators: {
                                notEmpty: {
                                    message: 'Password is required'
                                },
                                stringLength: {
                                    min:8,
                                    max:50,
                                    message: 'Password must be atleast 8 characters and maximum of 50 characters'
                                }
                            }
                        },
                        cpassword: {
                            validators: {
                                notEmpty: {
                                    message: 'Confirm Password is required'
                                },
                                identical: {
                                    compare: function() {
                                        //return _formEl.querySelector('[name="password"]').value;
                                        return $("input[name='password'").val();
                                    },
                                    message: 'The password and its confirm are not the same'
                                },
                                stringLength: {
                                    min:8,
                                    max:50,
                                    message: 'Confirm Password must be atleast 8 characters and maximum of 50 characters'
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

            $("#btn_save_pass").on('click', function(e) {
                e.preventDefault();

                validation.validate().then(function(status) {
                    if (status == 'Valid') 
                    {
                        Swal.fire({
                            title: "Are you sure?",
                            text: "You want to update your password?!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Yes, please!",
                            cancelButtonText: "No, cancel!",
                            customClass: {
                               confirmButton: "btn btn-success mt-0"
                            },
                            reverseButtons: true
                        }).then(function(result) {
                            if (result.value) {
                                var fd = new FormData($("#form-change-pass")[0]);
                                $.ajax({
                                    url : update_pass_url,
                                    data: fd,
                                    processData: false,
                                    contentType: false,
                                    type: "POST",
                                    beforeSend: function() {
                                        _beforeSend();
                                        _disableButton(true);
                                    },
                                    complete: function(xhr) {
                                        _complete();
                                        _disableButton(false);
                                    },
                                    success:function(res)
                                    {
                                        if(res == 'success') {
                                            forSwal("Password has been updated!", "success", "btn-success");
                                            $("#form-change-pass")[0].reset();
                                        }
                                        else if( res == 'invalid_pass') {
                                            forSwal("Old password is incorrect! ", "error", "btn-danger");
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
                        forSwal("Sorry, looks like there are some errors detected, please try again.", "error", "btn-danger");
                    }
                });
            });

            $("#btn_cancel_pass").click(function(){
                validation.resetForm();
            });
        };
    /***************** BEGIN CORE ****************/

	return {
		// public functions
		init: function () {
			_handleAcctDetails();
            _handleChangePass();
		}
	};

}();

jQuery(document).ready(function () {
	KTUserProfile.init();
});
