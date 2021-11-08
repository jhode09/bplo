"use strict";
var table;
var orid;

menuActive('li-menu-bplo', 'li-submenu-permitapp', 'li-lastmenu-permitapp-createapp');

//Edit Orseries
var KTEditORSeries = function(id) {
	orid = id;
	$.ajax({
		url : fetch_orseries_single_url,
		type: "post",
		data: {"id" : id},
		success: function(res) {
			if ( res == "not_found") {
				forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
			} else {
				$("input[name='beginningUpdate']").val(res.Beginning);
				$("input[name='endingUpdate']").val(res.Ending);
				$("input[name='countUpdate']").val(res.Count);
				$("input[name='balanceUpdate']").val(res.Balance);
				$("#editDetailsModal").modal('show');
			}
		}
	})
}

// Class definition
var KTCreateApp = function () {

	/***************** BEGIN UTIL ****************/
		$.ajaxSetup({
	        headers: {
	            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
	        }
	    });

	    $("#create-tab").click(function(){
	    	window.history.replaceState(null, null, "?menu=create");
	    })

	    $("#list-tab").click(function(){
	    	window.history.replaceState(null, null, "?menu=list");
	    	_loadTable();
	    })

		//Get url Parameter
		var _getUrlParameter = function(sParam) {
		    var sPageURL = window.location.search.substring(1),
		        sURLVariables = sPageURL.split('&'),
		        sParameterName,
		        i,
		        menu;

		    for (i = 0; i < sURLVariables.length; i++) {
		        sParameterName = sURLVariables[i].split('=');

		        if (sParameterName[0] === sParam) {
		            menu = sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
		        }
		    }
		    if(menu == "list") {
				//_loadTable();
				$("#list-tab").click();
		    } else {
		    	$("#create-tab").click();
		    }
		};
	/***************** END UTIL ******************/

	//Disable Button
	var _disableButton = function(bool) {
		$("#btn_save").prop('disabled', bool);
		$("#btn_cancel").prop('disabled', bool);
	}

	//Setting up validation in Form
    var _handleCreateForm = function() {
        var validation;

        validation = FormValidation.formValidation(
            KTUtil.getById('form-create-orseries'),
            {
                fields: {
                    beginning: {
                        validators: {
                            notEmpty: {
                                message: 'Beginning is required'
                            },
                            stringLength: {
                                max:11,
                                message: 'Maximum of 11 digits only'
                            }
                        }
                    },
                    ending: {
                        validators: {
                            notEmpty: {
                                message: 'Ending is required'
                            },
                            stringLength: {
                                max:11,
                                message: 'Maximum of 11 digits only'
                            }
                        }
                    },
                    count: {
                        validators: {
                            notEmpty: {
                                message: 'Count is required'
                            },
                            stringLength: {
                                max:11,
                                message: 'Maximum of 11 digits only'
                            }
                        }
                    },
                    balance: {
                        validators: {
                            notEmpty: {
                                message: 'Balance is required'
                            },
                            stringLength: {
                                max:11,
                                message: 'Maximum of 11 digits only'
                            }
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

        $("#btn_save").on('click', function(e) {
            e.preventDefault();

            validation.validate().then(function(status) {
                if (status == 'Valid') 
                {
                    var fd = new FormData($("#form-create-orseries")[0]);
                    $.ajax({
                        url : create_orseries_url,
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
                                $("#form-create-orseries")[0].reset();
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

	return {
		// public functions
		init: function () {
			_handleCreateForm();
		}
	};

}();

jQuery(document).ready(function () {
	KTCreateApp.init();
});
