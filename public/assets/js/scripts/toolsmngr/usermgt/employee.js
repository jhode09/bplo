"use strict";
var showPass = true, showCPass = true, table;

//Adding Class of Nav to become active
menuActive('li-menu-tools', 'li-submenu-tools-usermgt', 'li-lastmenu-tools-usermgt-emp');

//View Details
var KTViewDetails = function(id) {
	$.ajax({
		url : fetch_empdetails_url,
		type: "post",
		data: { id : id },
		dataType: "json",
		success: function(res) {
			if( res != "not_found") {

				Object.keys(res[0]).forEach(function(key) {
					var spanID = "#"+key;
				  	$(spanID).text(res[0][key])
				})

				$("#empDetailsModal").modal('show');
			} else {
				forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
			}
		},
		error: function(a,b,c) {
			forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
		}
	})
}

//Edit Details
var KTEditDetails = function(id) {
	$.ajax({
		url : check_emp_exists_url,
		type: "post",
		data: { id: id },
		beforeSend: function() {
	        _beforeSend();
	    },
	    xhr: function() {
	        return _xhr();
	    },
	    complete: function(xhr) {
	        _complete();
	    },
		success:function(res) {
			if(res != "not_found")
				window.location.replace("/tools/usermgt/edit-emp/" + res);
			else {
				forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
			}
		},
		error: function(a,b,c) {
			forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
		}
	})
}

//Toggle Show Pass
var ShowPass = function(option) {
	if( option == 1 ) {
		var input = $("input[name='password']");
		var icon = $("#iconPword");
		if( showPass && input.val() != "") {
			input.attr('type', 'text');
			icon.removeClass('fas fa-lock').addClass('fas fa-lock-open');
		} else {
			input.attr('type', 'password');
			icon.removeClass('fas fa-lock-open').addClass('fas fa-lock');
		}
		showPass = !showPass;
	} else {
		var input = $("input[name='cpassword']");
		var icon = $("#iconCPword");
		if( showCPass && input.val() != "") {
			input.attr('type', 'text');
			icon.removeClass('fas fa-lock').addClass('fas fa-lock-open');
		} else {
			input.attr('type', 'password');
			icon.removeClass('fas fa-lock-open').addClass('fas fa-lock');
		}
		showCPass = !showCPass;
	}
}

// Class definition
var KTEmployee = function () {

	$.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

	// Base elements
	var _wizardEl;
	var _formEl;
	var _wizard;
	var _validations = [];

	/*********************************** BEGIN UTILITY *******************************************/
		var _hideDiv = function(showDiv) {
			var divs = ['#addEmpContent', '#empListContent', '#editUserContent'];
			for (var i = 0; i < divs.length; i++) {
				if(divs[i] != showDiv) {
					$(divs[i]).hide(0)
				}
			}
			$(showDiv).show(0);
		}

		var _activeTab = function(tab) {
			$(".tab-panel").removeClass('text-primary');
			$(".tab-panel").removeClass('font-size-h6');
			$(tab).addClass('text-primary');
			$(tab).addClass('font-size-h6');
		}

		$("#empListNav").click(function() {
			_hideDiv("#empListContent");
			_activeTab("#empListNav");
			_loadTable();
			window.history.replaceState(null, null, "?action=list");
		});

		$("#addEmpNav").click(function() {
			_hideDiv("#addEmpContent");
			_activeTab("#addEmpNav");
			window.history.replaceState(null, null, "?action=create");
		});

		$("#editUserNav").click(function() {
			_hideDiv("#editUserContent");
			_activeTab("#editUserNav");
		});

		//Get url Parameter
		var _getUrlParameter = function(sParam) {
		    var sPageURL = window.location.search.substring(1),
		        sURLVariables = sPageURL.split('&'),
		        sParameterName,
		        i,
		        action;

		    for (i = 0; i < sURLVariables.length; i++) {
		        sParameterName = sURLVariables[i].split('=');

		        if (sParameterName[0] === sParam) {
		            action = sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
		        }
		    }

		    if(action == "list") {
				_hideDiv("#empListContent");
				_activeTab("#empListNav");
				_loadTable();
		    } else {
		    	_hideDiv("#addEmpContent");
				_activeTab("#addEmpNav");
		    }
		};
	/***********************************   END UTILITY *******************************************/

	/*********************************** BEGIN FUNCTIONS *****************************************/
		// Initial Wizard
		var initWizard = function () {
			_wizard = new KTWizard(_wizardEl, {
				startStep: 1,
				clickableSteps: true
			});

			_wizard.on('beforeNext', function (wizard) {
				_wizard.stop();

				var validator = _validations[wizard.getStep() - 1];
				validator.validate().then(function (status) {
					if (status == 'Valid') {

						if(_wizard.currentStep != 4 ) {
							_wizard.goNext();
						} else {
							//Check Email
							var email = $("input[name='email']").val();
							$.ajax({
								url : check_email_url,
								type: "post",
								data: { "email" : email },
								success: function(res) {
									if(res == "true") {
										$("input[name='email']").removeClass('is-valid').addClass('is-invalid').focus();
										Swal.fire({
											text: "Email is already exists",
											icon: "error",
											buttonsStyling: false,
											confirmButtonText: "Ok, got it!",
											customClass: {
												confirmButton: "btn font-weight-bold btn-danger"
											}
										})
									} else {
										$("input[name='email']").removeClass('is-invalid').addClass('is-valid').focus();
										_wizard.goNext();
										_displayDetails();
									}
								}, 
								error:function(a,b,c) {
		                            forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
		                        }
							})
						}
					} else {
						Swal.fire({
							text: "Sorry, looks like there are some errors detected, please try again.",
							icon: "error",
							buttonsStyling: false,
							confirmButtonText: "Ok, got it!",
							customClass: {
								confirmButton: "btn font-weight-bold btn-danger"
							}
						}).then(function () {
						});
					}
				});
			});

			// Change event
			_wizard.on('change', function (wizard) {
			});
		}

		//Display Details
		var _displayDetails = function() {
			$("#spanFname").text($("input[name='Fname']").val());
			$("#spanLname").text($("input[name='Lname']").val());
			$("#spanMname").text($("input[name='Mname']").val());
			$("#spanNameExt").text($("input[name='nameExt']").val());
			$("#spanCivilStatus").text($("select[name='civilStatus'] option:selected").text());
			$("#spanBloodType").text($("input[name='bloodType']").val());
			$("#spanHeight").text($("input[name='height']").val());
			$("#spanWeight").text($("input[name='weight']").val());
			$("#spanSex").text($("select[name='sex'] option:selected").text());
			$("#spanDOB").text($("input[name='dateOfBirth']").val());
			$("#spanPOB").text($("input[name='placeOfBirth']").val());
			$("#spanLot").text($("input[name='lot']").val());
			$("#spanStreet").text($("input[name='street']").val());
			$("#spanVillage").text($("input[name='village']").val());
			$("#spanBrgy").text($("input[name='brgy']").val());
			$("#spanCity").text($("input[name='city']").val());
			$("#spanProvince").text($("input[name='province']").val());
			$("#spanZipCode").text($("input[name='zipCode']").val());

			$("#spanSpouseLname").text($("input[name='spouseLname']").val());
			$("#spanSpouseFname").text($("input[name='spouseFname']").val());
			$("#spanSpouseMname").text($("input[name='spouseMname']").val());
			$("#spanSpouseNameExt").text($("input[name='spouseNameExt']").val());
			$("#spanSpouseOccupation").text($("input[name='spouseOccupation']").val());
			$("#spanSpouseEmployer").text($("input[name='spouseEmployer']").val());
			$("#spanSpouseBussAdd").text($("input[name='spouseBussAdd']").val());
			$("#spanSpouseTelNo").text($("input[name='spouseTelNo']").val());

			$("#spanFatherLname").text($("input[name='fatherLname']").val());
			$("#spanFatherFname").text($("input[name='fatherFname']").val());
			$("#spanFatherMname").text($("input[name='fatherMname']").val());
			$("#spanFatherNameExt").text($("input[name='fatherNameExt']").val());

			$("#spanMotherLname").text($("input[name='motherLname']").val());
			$("#spanMotherFname").text($("input[name='motherFname']").val());
			$("#spanMotherMname").text($("input[name='motherMname']").val());
			$("#spanMotherNameExt").text($("input[name='motherNameExt']").val());
			$("#spanMotherNameExt").text($("input[name='motherNameExt']").val());

			$("#spanGSIS").text($("input[name='gsis']").val());
			$("#spanPAGIBIG").text($("input[name='pagibig']").val());
			$("#spanPHILHEALTH").text($("input[name='philhealth']").val());
			$("#spanSSS").text($("input[name='sss']").val());
			$("#spanTIN").text($("input[name='tin']").val());
			$("#spanTELNO").text($("input[name='telNo']").val());
			$("#spanMobileNo").text($("input[name='mobileNo']").val());

			$("#spanDepartment").text($("select[name='department'] option:selected").text());
			$("#spanEmail").text($("input[name='email']").val());
			$("#spanPassword").text($("input[name='password']").val());
		}

		//Check Email
		var _checkEmail = function() {
			var email = $("input[name='email']").val();
			$.ajax({
				url : check_email_url,
				type: "post",
				data: { "email" : email },
				async: false,
				success: function(res) {
					return res;
				}
			})
		}

		//Initial Validation
		var initValidation = function () {
			// Step 1
			_validations.push(FormValidation.formValidation(
				_formEl,
				{
					fields: {
						//Personal Info
						Lname: {
							validators: {
								notEmpty: {
									message: 'Last name is required'
								},
								stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 characters only'
	                            }
							}
						},
						Fname: {
							validators: {
								notEmpty: {
									message: 'First name is required'
								},
								stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 characters only'
	                            }
							}
						},
						Mname: {
							validators: {
								stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 characters only'
	                            }
							}
						},
						nameExt: {
							validators: {
								stringLength: {
	                                max:10,
	                                message: 'Maximum of 10 characters only'
	                            }
							}
						},
						dateOfBirth: {
							validators: {
								notEmpty: {
									message: 'Date of birth is required'
								}
							}
						},
						placeOfBirth: {
							validators: {
								notEmpty: {
									message: 'Place of birth is required'
								},
								stringLength: {
	                                max:100,
	                                message: 'Maximum of 100 characters only'
	                            }
							}
						},
						citizenship: {
							validators: {
								notEmpty: {
									message: 'Citizenship is required'
								},
								stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 characters only'
	                            }
							}
						},
						bloodType: {
							validators: {
								stringLength: {
	                                max:5,
	                                message: 'Maximum of 5 characters only'
	                            }
							}
						},
						height: {
							validators: {
								stringLength: {
	                                max:5,
	                                message: 'Maximum of 5 numbers only'
	                            }
							}
						},
						weight: {
							validators: {
								stringLength: {
	                                max:5,
	                                message: 'Maximum of 5 numbers only'
	                            }
							}
						},
						//Residency Info
						lot: {
							validators: {
								stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 characters only'
	                            }
							}
						},
						street: {
							validators: {
								stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 characters only'
	                            }
							}
						},
						village: {
							validators: {
								stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 characters only'
	                            }
							}
						},
						brgy: {
							validators: {
								notEmpty: {
									message: 'Barangay is required'
								},
								stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 characters only'
	                            }
							}
						},
						city: {
							validators: {
								notEmpty: {
									message: 'City/Municipality is required'
								},
								stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 characters only'
	                            }
							}
						},
						province: {
							validators: {
								notEmpty: {
									message: 'Province is required'
								},
								stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 characters only'
	                            }
							}
						},
						zipCode: {
							validators: {
								notEmpty: {
									message: 'Zip Code is required'
								},
								digits: {
							      	message: 'Zip code is not a valid digits'
							    },
								stringLength: {
	                                max:5,
	                                message: 'Maximum of 5 characters only'
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
						spouseLname: {
							validators: {
								stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 characters only'
	                            }
							}
						},
						spouseFname: {
							validators: {
								stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 characters only'
	                            }
							}
						},
						spouseMname: {
							validators: {
								stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 characters only'
	                            }
							}
						},
						spouseNameExt: {
							validators: {
								stringLength: {
	                                max:10,
	                                message: 'Maximum of 10 characters only'
	                            }
							}
						},
						spouseOccupation: {
							validators: {
								stringLength: {
	                                max:100,
	                                message: 'Maximum of 100 characters only'
	                            }
							}
						},
						spouseEmployer: {
							validators: {
								stringLength: {
	                                max:150,
	                                message: 'Maximum of 150 characters only'
	                            }
							}
						},
						spouseBussAdd: {
							validators: {
								stringLength: {
	                                max:150,
	                                message: 'Maximum of 150 characters only'
	                            }
							}
						},
						spouseTelNo: {
							validators: {
								digits: {
							      	message: 'Telephone no. is not a valid digits'
							    },
								stringLength: {
	                                max:15,
	                                message: 'Maximum of 15 characters only'
	                            }
							}
						},
						fatherLname: {
							validators: {
								notEmpty: {
									message: 'Father last name is required'
								},
								stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 characters only'
	                            }
							}
						},
						fatherFname: {
							validators: {
								notEmpty: {
									message: 'Father first name is required'
								},
								stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 characters only'
	                            }
							}
						},
						fatherMname: {
							validators: {
								stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 characters only'
	                            }
							}
						},
						fatherNameExt: {
							validators: {
								stringLength: {
	                                max:10,
	                                message: 'Maximum of 10 characters only'
	                            }
							}
						},
						motherLname: {
							validators: {
								notEmpty: {
									message: 'Mother last name is required'
								},
								stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 characters only'
	                            }
							}
						},
						motherFname: {
							validators: {
								notEmpty: {
									message: 'Mother first name is required'
								},
								stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 characters only'
	                            }
							}
						},
						motherMname: {
							validators: {
								stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 characters only'
	                            }
							}
						},
						motherNameExt: {
							validators: {
								stringLength: {
	                                max:10,
	                                message: 'Maximum of 10 characters only'
	                            }
							}
						},
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
						gsis: {
							validators: {
							    stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 digits only'
	                            }
							}
						},
						pagibig: {
							validators: {
							    stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 digits only'
	                            }
							}
						},
						philhealth: {
							validators: {
							    stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 digits only'
	                            }
							}
						},
						sss: {
							validators: {
							    stringLength: {
	                                max:45,
	                                message: 'Maximum of 45 digits only'
	                            }
							}
						},
						tin: {
							validators: {
							    stringLength: {
	                                max:16,
	                                message: 'Maximum of 16 digits only'
	                            }
							}
						},
						telNo: {
							validators: {
								digits: {
							      	message: 'Telephone no. is not a valid digits'
							    },
							    stringLength: {
	                                max:15,
	                                message: 'Maximum of 15 digits only'
	                            }
							}
						},
						mobileNo: {
							validators: {
								notEmpty: {
									message: 'Delivery type is required'
								},
								digits: {
							      	message: 'Mobile phone is not a valid digits'
							    },
							    stringLength: {
							    	min:11,
	                                max:11,
	                                message: 'Maximum of 11 digits'
	                            }
							}
						},
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
						email: {
							validators: {
								notEmpty: {
									message: 'Email is required'
								},
								emailAddress: {
									message: 'The value is not a valid email address'
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
	                                    return _formEl.querySelector('[name="password"]').value;
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
						bootstrap: new FormValidation.plugins.Bootstrap()
					}
				}
			));

			//Save
			$("#btn_submit").on('click', function(e){
				e.preventDefault();

				Swal.fire({
                    title: "Are you sure?",
                    text: "You want to create this?!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, please!",
                    cancelButtonText: "No, cancel!",
                    customClass: {
                       confirmButton: "btn btn-primary mt-0"
                    },
                    reverseButtons: true
                }).then(function(result) {
                    if (result.value) {
                    	var fd = new FormData($("#form-add-employee")[0]);
						fd.append('createType', 2);
						fd.append('type', 1);
			            $.ajax({
			                url : create_emp_url,
			                data: fd,
			                processData: false,
			                contentType: false,
			                type: "POST",
			                beforeSend: function() {
			                    _beforeSend();
			                    $("#btn_submit").prop('disabled', true);
			                },
			                xhr: function() {
			                    return _xhr();
			                },
			                complete: function(xhr) {
			                    _complete();
			                },
			                success:function(res)
			                {
			                    if(res == 'success') {
			                    	$("#form-add-employee")[0].reset();
			                        Swal.fire({
									        title: "Successfully Saved!",
									        icon: "success",
									        text: "Please wait.",
									        timer: 1000,
									        onOpen: function() {
									            Swal.showLoading()
									        }
									    }).then(function(result) {
									        if (result.dismiss === "timer") {
									        	window.location.reload();
									        }
									    })
			                    }
			                    else {
			                    	$("#btn_submit").prop('disabled', false);
			                        forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
			                    }
			                },
			                error:function(a,b,c)
			                {
			                	 $("#btn_submit").prop('disabled', false);
			                    forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
			                }
			            });
                    }
                });
			})

			//Update
			$("#btn_update").on('click', function(e){
				e.preventDefault();
			})
		}

		//Load DataTable
	    var _loadTable = function() {

	    	if( table ) { 
	    		table.clear();
	    		table.destroy();
	    	}

	        table = $('#tbl_users').DataTable({
	        	responsive: true,
	            processing: true,
	            serverSide: true,
	            bLengthChange: false,
	            language: {                
		            infoFiltered: ""
		        },
	            ajax: {
	                method : "POST",
	                url    : fetch_emp_url,
	                data: {
						columnsDef: [
							'DT_RowIndex', 
							null, 
							'FullName', 
							null, 
							'Birthday', 
							'Email', 
							'CreatedAt', 
							'Action'
						],
					},
	            },
	            columns: [
	            	{data: 'DT_RowIndex'},
	            	{data: null},
					{data: 'FullName'},
					{data: null},
					{data: 'Birthday'},
					{data: 'Email'},
					{data: 'CreatedAt'},
					{data: 'Action', orderable:false, searchable:false},
				],
	            columnDefs: [
	            	{   
	                    targets: 1,
	                    title: "Employee",
	                    width: 150,
	                    render: function( data, type, row ) {
                        var colors = ['bg-success', 'bg-info', 'bg-primary', 'bg-danger', 'bg-warning'];
                        $('.post-content').each(function() {
                            $(this).addClass(colors[Math.floor(Math.random() * colors.length)]);
                        });
                         return `<div class="d-flex align-items-center">\
                                    <div class="symbol symbol-50 flex-shrink-0 align-self-start align-self-xxl-center mt-2">\
                                        <div class="symbol-label post-content text-light" >\
                                            <h1 style="font-size:30px !important; text-transform: uppercase;">`+ row.FullName[0] +`</h1>
                                        </div>
                                    </div>\
                                    <div class="ml-3">\
                                        <span class="text-dark-75 font-weight-bold line-height-sm d-block pb-2">` + row.FullName + `</span>\
                                        <a href="#" class="text-muted text-hover-primary">` + 'position	' + `</a>\
                                    </div>\
                                </div>`;
                        
                    }
	                },
	                {   
	                    targets: 3,
	                    title: "Department",
	                    render: function( data, type, row ) {
	                        return "Department"
	                    }
	                }
	            ]
	        });
	    };
	/***********************************   END FUNCTIONS *****************************************/

	//Toggle Civil Status
	$("select[name='civilStatus']").change(function(){
		if($(this).val() != 1) {
			$(".spouseDetails").show(0);
		} else {
			$(".spouseDetails").hide(0);
		}
	})

	return {
		// public functions
		init: function () {
			_wizardEl = KTUtil.getById('wizard-create');
			_formEl = KTUtil.getById('form-add-employee');
			_hideDiv('#addEmpContent');
			_getUrlParameter("action");
			initWizard();
			initValidation();
			$(".spouseDetails").hide(0);
			$("input[name='dateOfBirth']").attr("max", dateToday);
		}
	};

}();

jQuery(document).ready(function () {
	KTEmployee.init();
});
