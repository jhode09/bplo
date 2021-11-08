"use strict";

// Class definition
var KTWizard2 = function () {
	// Base elements
	var _wizardEl;
	var _formEl;
	var _wizard;
	var _validations = [];

	// Private functions
	var initWizard = function () {
		// Initialize form wizard
		_wizard = new KTWizard(_wizardEl, {
			startStep: 5, // initial active step number
			clickableSteps: true // to make steps clickable this set value true and add data-wizard-clickable="true" in HTML for class="wizard" element
		});

		// Validation before going to next page
		_wizard.on('beforeNext', function (wizard) {
			// Don't go to the next step yet
			_wizard.stop();

			// Validate form
			var validator = _validations[wizard.getStep() - 1]; // get validator for currnt step
			validator.validate().then(function (status) {
				if (status == 'Valid') {
					_wizard.goNext();
					if(_wizard.currentStep == 6) {
						for (var i = 0; i < 60; i++) {
							var formVal  = $("#kt_form")[0][i].value;
							var formName = $("#kt_form")[0][i].name;
							if(formName == "location_type"){
								$("#" + formName).text( $('input[name=location_type]:checked').val());
							}
							else{
								$("#" + formName).text(formVal);
							}
						}
					}
					// KTUtil.scrollTop();
				} else {
					Swal.fire({
						text: "Sorry, looks like there are some errors detected, please try again.",
						icon: "error",
						buttonsStyling: false,
						confirmButtonText: "Ok, got it!",
						customClass: {
							confirmButton: "btn font-weight-bold btn-light"
						}
					}).then(function () {
						// KTUtil.scrollTop();
					});
				}
			});
		});

		// Change event
		_wizard.on('change', function (wizard) {
			// KTUtil.scrollTop();
		});
	}

	var initValidation = function () {
		// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
		// Step 1
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {

					application_type: {
						validators: {
							notEmpty: {
								message: 'Application type is required'
							}
						}
					},
					paymentFrequency: {
						validators: {
							notEmpty: {
								message: 'Mode of payment is required'
							}
						}
					}
					
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));

		// Step 2
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					businessName: {
						validators: {
							notEmpty: {
								message: 'Business name is required'
							}
						}
					},
					businessTin: {
						validators: {
							notEmpty: {
								message: 'TIN is required'
							},
							digits: {
								message: 'TIN value is not valid. Only numbers is allowed'
							}

						}
					},
					emailAddress: {
						validators: {
							notEmpty: {
								message: 'Email is required'
							},
							emailAddress: {
								message: 'The value is not a valid email address'
							}
						}
					},
					phoneNumber: {
						validators: {
							notEmpty: {
								message: 'Phone number is required'
							}
						}
					},
					taxPayerLname: {
						validators: {
							notEmpty: {
								message: 'Last name is required'
							}
						}
					},
					taxPayerFname: {
						validators: {
							notEmpty: {
								message: 'First name is required'
							}
						}
					},
					presidentLname:{
						validators: {
							notEmpty: {
								message: 'Last name is required'
							}
						}
					},
					presidentFname:{
						validators: {
							notEmpty: {
								message: 'First name is required'
							}
						}
					},
					totalCabuyenoEmployee:{
						validators: {
							notEmpty: {
								message: 'This field is required'
							}
						}
					},
					totalBuildingEmployee:{
						validators: {
							notEmpty: {
								message: 'This field is required'
							}
						}
					}

				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));

		// Step 3
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					supportingID: {
						validators: {
							notEmpty: {
								message: 'Choose Supporting ID to present'
							}
						}
					},
					supportBusinessID1: {
						validators: {
							notEmpty: {
								message: 'Permit number is required'
							}
						}
					},
					supportDateRegistration1: {
						validators: {
							notEmpty: {
								message: 'Date Registration is required'
							}
						}
					},
					supportExpiryDate1: {
						validators: {
							notEmpty: {
								message: 'Expiration is required'
							}
						}
					},
					supportBusinessID2: {
						validators: {
							notEmpty: {
								message: 'Permit number is required'
							}
						}
					},
					supportDateRegistration2: {
						validators: {
							notEmpty: {
								message: 'Date Registration is required'
							}
						}
					},
					supportExpiryDate2: {
						validators: {
							notEmpty: {
								message: 'Expiration is required'
							}
						}
					}

				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));

		// Step 4
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					locaddress1: {
						validators: {
							notEmpty: {
								message: 'Address is required'
							}
						}
					},
					locpostcode: {
						validators: {
							notEmpty: {
								message: 'Postcode is required'
							}
						}
					},
					loccity: {
						validators: {
							notEmpty: {
								message: 'City is required'
							}
						}
					},
					locstate: {
						validators: {
							notEmpty: {
								message: 'State is required'
							}
						}
					},
					loccountry: {
						validators: {
							notEmpty: {
								message: 'Country is required'
							}
						}
					}
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));

		// Step 5
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					
					organizationType: {
						validators: {
							notEmpty: {
								message: 'Organization type is required'
							}
						}
					}
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));

		$.ajaxSetup({
	       headers: {
	            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
	        }
	    });

		
        $("#btn_submit_application").on('click', function(e) {
            e.preventDefault();
            var fd = new FormData($("#kt_form")[0]);
           	$.ajax({
                    url : create_app_url,
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
                    complete: function(xhr) {
                        _complete();
                    },
                    success:function(res)
                    {
                    	console.log(res);
                        if(res == 'success') {
                            forSwal("Successfully Saved", "success", "btn-success");
                            $("#kt_form")[0].reset();
	                        $(".text-label").text("");
	                        location.reload();
	                        
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
            console.log(fd);
        })
	}

	return {
		// public functions
		init: function () {
			_wizardEl = KTUtil.getById('kt_wizard_v2');
			_formEl = KTUtil.getById('kt_form');

			initWizard();
			initValidation();
		}
	};
}();

jQuery(document).ready(function () {
	KTWizard2.init();
});