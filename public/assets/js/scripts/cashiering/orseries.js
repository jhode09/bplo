"use strict";
var table1, table2;
var orid;
var ortype = 1;

menuActive('li-menu-cashiering', 'li-submenu-cashiering-orseries');

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
var KTORSeries = function () {

	/***************** BEGIN UTIL ****************/
		$.ajaxSetup({
	        headers: {
	            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
	        }
	    });

	    $("#create-tab").click(function(){

	    	window.history.replaceState(null, null, "?tab=or&menu=create");
	    });

	    $("#list-tab").click(function(){
	    	window.history.replaceState(null, null, "?tab=or&menu=list");
	    	_loadTableOR();
	    });

        $("#create-tab-ctc").click(function(){

            window.history.replaceState(null, null, "?tab=ctc&menu=create");
        });

        $("#list-tab-ctc").click(function(){
            window.history.replaceState(null, null, "?tab=ctc&menu=list");
            _loadTableCTCOR();
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
    		$("#btn_save").prop('disabled', bool);
    		$("#btn_cancel").prop('disabled', bool);
            $("#btn_save_ctc").prop('disabled', bool);
            $("#btn_cancel_ctc").prop('disabled', bool);
    	};

        //Compute Count
        var _computeCount = function(form){
            var begin = $(form + " input[name='beginning']").val();
            var end = $(form + " input[name='ending']").val();
            var count = parseInt(end - begin) + 1;
            if(count >= 1) {
                $(form + " input[name='count']").val(count);
                $(form + " input[name='balance']").val(count);
            } else {
                $(form + " input[name='count']").val(0);
                $(form + " input[name='balance']").val(0);
            }
        };

    	//Setting up validation in Form
        var _handleCreateORForm = function() {
            var validation, validCount = true;

            validation = FormValidation.formValidation(
                KTUtil.getById('form-create-orseries'),
                {
                    fields: {
                        collector: {
                            validators: {
                                notEmpty: {
                                    message: 'Collector is required'
                                }
                            }
                        },
                        formType: {
                            validators: {
                                notEmpty: {
                                    message: 'Form Type is required'
                                }
                                /*,
                                stringLength: {
                                    max:11,
                                    message: 'Maximum of 11 characters only'
                                }*/
                            }
                        },
                        srs: {
                            validators: {
                                notEmpty: {
                                    message: 'SRS is required'
                                },
                                stringLength: {
                                    max:11,
                                    message: 'Maximum of 11 characters only'
                                }
                            }
                        },
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

            $("#form-create-orseries input[name='beginning'], #form-create-orseries input[name='ending']").on('keyup', function(){
                _computeCount("#form-create-orseries");
            });

            $("#btn_save").on('click', function(e) {
                e.preventDefault();

                validation.validate().then(function(status) {
                    if (status == 'Valid') 
                    {
                        if($("#form-create-orseries input[name='count'], #form-create-orseries input[name='balance']").val() != 0) {
                            Swal.fire({
                                title: "Are you sure?",
                                text: "You create this OR Series?!",
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
                                    var fd = new FormData($("#form-create-orseries")[0]);
                                    fd.append('orType', ortype);
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
                                            res = res.trim();
                                            if(res == 'success') {
                                                forSwal("Successfully Saved", "success", "btn-success");
                                                $("form-create-orseries select[name='collector']").val('').selectpicker('refresh');
                                                $("#form-create-orseries")[0].reset();
                                            } 
                                            else if (res == 'exists') {
                                                forSwal("This entry is already exists.", "error", "btn-danger");
                                            }
                                            else if (res == 'between') {
                                                forSwal("Invalid beginning or ending. It seems like you entered between of the existing O.R. Series.", "error", "btn-danger");
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
                        } else {
                            forSwal('Invalid input of beginning or ending. Ending field must be bigger than Beginning field.', 'error', 'btn-danger');
                        }
                    }
                    else 
                    {
                        forSwal("Sorry, looks like there are some errors detected, please try again.", "error", "btn-danger");
                    }
                });
            });

            $("#btn_cancel").click(function(){
                $("#form-create-orseries select[name='collector']").val('').selectpicker('refresh');
                validation.resetForm();
            });
        };

        //Setting up validation in Form
        var _handleUpdateORForm = function() {
            var validation;

            validation = FormValidation.formValidation(
                KTUtil.getById('form-update-orseries'),
                {
                    fields: {
                        beginningUpdate: {
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
                        endingUpdate: {
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
                        countUpdate: {
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
                        balanceUpdate: {
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

            $("#btn_update").on('click', function(e) {
                e.preventDefault();

                validation.validate().then(function(status) {
                    if (status == 'Valid') 
                    {
                    	Swal.fire({
    				        title: "Are you sure?",
    				        text: "You want to update this?!",
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
    				            var fd = new FormData($("#form-update-orseries")[0]);
    		                    fd.append('id', orid);
    		                    $.ajax({
    		                        url : update_orseries_url,
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
                                        res = res.trim();
    		                            if(res == 'success') {
    		                                forSwal("Successfully Updated", "success", "btn-success");
    		                                $("#form-update-orseries")[0].reset();
    		                                table.ajax.reload();
    		                                $("#editDetailsModal").modal('hide');
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
            })
        };

        //Load DataTable
        var _loadTableOR = function() {

        	if( table1 ) { 
        		table1.clear();
        		table1.destroy(); 
        	}

        	table1 = $('#tbl_orseries').DataTable({
            	responsive: true,
                processing: true,
                serverSide: true,
                bLengthChange: false,
                info: false,
                language: {                
    	            infoFiltered: ""
    	        },
                ajax: {
                    method : "POST",
                    url    : fetch_orseries_url,
                    data: {
                        orType: ortype,
    					columnsDef: [
                            'DT_RowIndex',
                            'Type',
                            'Beginning', 
                            'Ending',
    						'Count', 
                            'Balance', 
                            'Collector', 
                            'CreatedBy'
                        ],
    				},
                },
                columns: [
                	{data: 'DT_RowIndex'},
                    {data: 'Type'},
    				{data: 'Beginning'},
    				{data: 'Ending'},
    				{data: 'Count'},
    				{data: 'Balance'},
    				{data: 'Collector'},
    				{data: 'CreatedBy'},
                    //{data: null},
    			],
                /*columnDefs: [
                	{
                        targets: 7,
                        title: "Action",
                        orderable: false,
                        render: function( data, type, row ) {
                        	var id = row.ORSeriesID;
                            return '\
                                <a type="button" onclick=KTEditORSeries("' + id + '") class="btn btn-icon btn-light btn-hover-primary btn-sm" title="Edit Details">\
    								<span class="svg-icon svg-icon-md svg-icon-primary">\
    									<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
    									    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
    									        <rect x="0" y="0" width="24" height="24"/>\
    									        <path d="M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z" fill="#000000" fill-rule="nonzero" transform="translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) "/>\
    									        <rect fill="#000000" opacity="0.3" x="5" y="20" width="15" height="2" rx="1"/>\
    									    </g>\
    									</svg>\
    								</span>\
    							</a>\
                            ';
                        }
                    }
                ]*/
            });
        };


        //Setting up validation in Form
        var _handleCreateCTCForm = function() {
            var validation;

            validation = FormValidation.formValidation(
                KTUtil.getById('form-create-ctcorseries'),
                {
                    fields: {
                        formType: {
                            validators: {
                                notEmpty: {
                                    message: 'CTC Type is required'
                                },
                                stringLength: {
                                    max:11,
                                    message: 'Maximum of 11 digits only'
                                }
                            }
                        },
                        srs: {
                            validators: {
                                notEmpty: {
                                    message: 'SRS is required'
                                },
                                stringLength: {
                                    max:11,
                                    message: 'Maximum of 11 digits only'
                                }
                            }
                        },
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

            $("#form-create-ctcorseries input[name='beginning'], #form-create-ctcorseries input[name='ending']").on('keyup', function(){
                _computeCount("#form-create-ctcorseries");
            });

            $("#btn_save_ctc").on('click', function(e) {
                e.preventDefault();

                validation.validate().then(function(status) {
                    if (status == 'Valid') 
                    {
                        if($("#form-create-ctcorseries input[name='count'], #form-create-ctcorseries input[name='balance']").val() != 0) {
                            Swal.fire({
                                title: "Are you sure?",
                                text: "You create this CTC OR Series?!",
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
                                    var fd = new FormData($("#form-create-ctcorseries")[0]);
                                    fd.append('orType', ortype);
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
                                                $("#form-create-ctcorseries select[name='collector']").val('').selectpicker('refresh');
                                                $("#form-create-ctcorseries")[0].reset();
                                            } else if( res == 'between' ) {
                                                forSwal("We found that you entered between with the existing beginning or ending.", "error", "btn-danger");
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
                        } else {
                            forSwal('Invalid input of beginning or ending. Ending field must be bigger than Beginning field.', 'error', 'btn-danger');
                        }
                    }
                    else 
                    {
                        forSwal("Sorry, looks like there are some errors detected, please try again.", "error", "btn-danger");
                    }
                });
            });

            $("#btn_cancel_ctc").click(function(){
                $("#form-create-ctcorseries select[name='collector']").val('').selectpicker('refresh');
                validation.resetForm();
            });
        };

        //Load DataTable
        var _loadTableCTCOR = function() {

            if( table2 ) { 
                table2.clear();
                table2.destroy(); 
            }

            table2 = $('#tbl_ctcorseries').DataTable({
                responsive: true,
                processing: true,
                serverSide: true,
                bLengthChange: false,
                info: false,
                language: {                
                    infoFiltered: ""
                },
                ajax: {
                    method : "POST",
                    url    : fetch_orseries_url,
                    data: {
                        orType: ortype,
                        columnsDef: [
                            'DT_RowIndex',
                            'Type',
                            'Beginning', 
                            'Ending',
                            'Count', 
                            'Balance', 
                            'Collector', 
                            'CreatedBy'
                        ],
                    },
                },
                columns: [
                    {data: 'DT_RowIndex'},
                    {data: 'Type'},
                    {data: 'Beginning'},
                    {data: 'Ending'},
                    {data: 'Count'},
                    {data: 'Balance'},
                    {data: 'Collector'},
                    {data: 'CreatedBy'},
                    //{data: null},
                ],
                /*columnDefs: [
                    {
                        targets: 7,
                        title: "Action",
                        orderable: false,
                        render: function( data, type, row ) {
                            var id = row.ORSeriesID;
                            return '\
                                <a type="button" onclick=KTEditORSeries("' + id + '") class="btn btn-icon btn-light btn-hover-primary btn-sm" title="Edit Details">\
                                    <span class="svg-icon svg-icon-md svg-icon-primary">\
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
                                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
                                                <rect x="0" y="0" width="24" height="24"/>\
                                                <path d="M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z" fill="#000000" fill-rule="nonzero" transform="translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) "/>\
                                                <rect fill="#000000" opacity="0.3" x="5" y="20" width="15" height="2" rx="1"/>\
                                            </g>\
                                        </svg>\
                                    </span>\
                                </a>\
                            ';
                        }
                    }
                ]*/
            });
        };
    /***************** BEGIN CORE ****************/

	return {
		// public functions
		init: function () {
			_handleCreateORForm();
			//_handleUpdateORForm();
            _handleCreateCTCForm();
			_getUrlParameter("tab", "menu");
            $("#form-create-orseries input[name='count']").prop('readonly', true);
            $("#form-create-ctcorseries input[name='count']").prop('readonly', true);
		}
	};

}();

jQuery(document).ready(function () {
	KTORSeries.init();
});
