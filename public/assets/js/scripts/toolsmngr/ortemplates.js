"use strict";

var items = new Array(),
	table,
	total_amount = 0,
	option = "create",
	tid;

//Adding Class of Nav to become active
menuActive('li-menu-tools', 'li-submenu-tools-ortemplates');


//Fetch Details
var KTTemplateDetails = function(id, templateDesc) {
	$("#templateDescSpan").text(templateDesc);
	$.ajax({
        url : fetch_template_details_url,
        type: "POST",
        data: {"id": id},
        beforeSend: function(){
        	_beforeSend();
        },
        complete: function() {
        	_complete();
        },
        success:function(res) {
        	$("#subAcctsDetails").empty();
        	var output = "";
        	var total = 0;
        	output += "<div class='row'>";
        	for (var i = 0; i < res.length; i++) {
        		total += (res[i].Amount * res[i].Qty);
        		output  += "<div class='col-lg-4'><span class='label label-dot label-dark mr-2'></span>"    + res[i].SubAcctTitle + "</div>";
        		output  += "<div class='col-lg-8 mb-2'> ₱ " + _addComma(parseFloat(res[i].Amount).toFixed(2)) + " x " + parseInt(res[i].Qty) + "</div>";
        	}
        	output += "</div>";
        	output += "<div class='col-lg-12 separator separator-solid mb-2'></div>";
        	$("#total_amount").text(_addComma(total.toFixed(2)));
        	$("#subAcctsDetails").append(output);
        	$("#templateDetailsModal").modal('show');
        }, 
        error:function(a,b,c)
        {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    })
}

//Edit Templates
var KTEditTemplate = function (id) {
	$("#editTemplateNav").click();
	$("select[name='template']").val(id);
	_fetchItems(id);
}

//Fetch Items
var _fetchItems = function(id) {
	$.ajax({
		url: fetch_single_template_url,
		type: "post",
		data: {"id": id},
		beforeSend: function() {			
			KTApp.block('.divSummary', {
			  	overlayColor: '#000000',
			  	state: 'danger',
			  	message: 'Please wait...'
			});
		},
		complete: function() {
			KTApp.unblock('.divSummary');
		},
		success:function(res) {
			if(res == "not_found") {
				forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
			} else {
				items = new Array();
				$.each(res, function(index, item){
					var data = {
						"id"    : item.SubAcctID,
						"qty"   : parseInt(item.Qty),
						'title' : item.SubAcctTitle,
						'amount': parseFloat(item.Amount).toFixed(2)
					};
					items.push(data);
				});
				$("#templateNameUpdate").val(res[0].TemplateName);
				$("#templateDescUpdate").val(res[0].TemplateDesc);
				$("#divTemplateDetails").show(0);
				_appendItem();
			}
		},
		error:function(a,b,c)
        {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
	})
}

//Add Item
var _addItem = function() {
	var subAcct;
	if(option == "create") {
		subAcct = $("select[name='subAccts']");
	} else {
		subAcct = $("select[name='subAcctsUpdate']");
	}

	if(subAcct.val() != "") {
		$.ajax({
			url:  add_item_url,
			type: "post",
			data: { id: subAcct.val() },
			beforeSend: function() {			
				KTApp.block('.divSummary', {
				  	overlayColor: '#000000',
				  	state: 'danger',
				  	message: 'Please wait...'
				});
			},
			complete: function() {
				KTApp.unblock('.divSummary');
			},
			success:function(res) {
				if(res == "not_found") {
					forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
				} else {
					var found = false;
					var data = {
						"id"    : subAcct.val(),
						"qty"   : 1,
						'title' : res.SubAcctTitle,
						'amount': parseFloat(res.Amount).toFixed(2)
					};
					if(items.length > 0 ) {
						$.each(items, function(index, item) {
							if(item.id == subAcct.val()) {
								item.qty++;
								found = true;
								return false;
							} else {
								found = false;
							}
						})
						if( !found ) {
							items.push(data);
						} 
					} else {
						items.push(data);
					}
					_appendItem();
				}
			}
		})
	}
}

//Append Item in Div
var _appendItem = function() {
	var div, input, span, button, output = "";

	if(option == "create") {
		div    = $("#divItems");
		span   = $("#total");
		button = $("#btn_create"); 
	} else {
		div    = $("#divItemsUpdate");
		span   = $("#totalUpdate");
		button = $("#btn_update");
	}

	div.empty();

	if(items.length > 0 ) {
		button.prop('disabled', false);
		$.each(items, function(index, item){
			output += '\
				<div class="col-lg-9 mt-5">\
					' + item.title + ' <br>\
					<label class="font-weight-bolder">\
						₱ <span>'+ _addComma(item.amount) +'</span> x <span> '+ item.qty +' </span>\
					</label>\
				</div>\
				<div class="col-lg-3 mt-5">\
					<button type="button" class="btn btn-sm btn-light-success mr-2" onclick="_addQty('+index+')"> + </button>\
					<button type="button" class="btn btn-sm btn-light-danger" onclick="_subQty('+index+')"> - </button>\
				</div>\
				<div class="col-lg-9"> &nbsp; </div>\
				<div class="col-lg-12 separator separator-dashed"></div>';
		});
	} else {

		button.prop('disabled', true);
		output += "<div class='col-lg-12'><center class='text-danger mt-5 font-size-h4'>No item Available</center></div>";
	}
	
	span.text(_addComma(_computeTotal().toFixed(2)));
	div.append(output);
}

//Add Qty
var _addQty = function(i) {
	$.each(items, function(index, item) {
		if(parseInt(index) == parseInt(i)) {
			item.qty++;
		}
	});
	_appendItem();
}

//Minus Qty
var _subQty = function(i) {
	$.each(items, function(index, item) {
		if(parseInt(index) == parseInt(i)) {
			if(item.qty <= 1) {
				items.splice(i, 1);
				return false;
			} else {
				item.qty--;
			}
		}
	});
	_appendItem();
}

//Compute Total
var _computeTotal = function(){
	var total = 0;
	$.each(items, function(index, item) {
		total += (item.amount * item.qty);
	});
	return total;
}

//Add Comma
var _addComma = function(val) {
	while (/(\d+)(\d{3})/.test(val.toString())){
	  val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	}
	return val;
}


// Class definition
var KTTemplates = function () {

	//Set Up Ajax CSRF
	$.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

	/******************************************* BEGIN UTILITY ************************************************/
		var _hideDiv = function(showDiv) {
			var divs = ['#addTemplateContent', '#templateListContent', '#editTemplateContent'];
			for (var i = 0; i < divs.length; i++) {
				if(divs[i] != showDiv) {
					$(divs[i]).hide(0)
				}
			}
			$(showDiv).show(0);
		}

		var _activeTab = function(tab) {
			$(".tab-panel").removeClass('text-primary');
			//$(".tab-panel").removeClass('font-size-h4');
			$(tab).addClass('text-primary');
			//$(tab).addClass('font-size-h4');
		}

		$("#templateListNav").click(function() {
			_hideDiv("#templateListContent");
			_activeTab("#templateListNav");
			_loadTable();
			window.history.replaceState(null, null, "?menu=list");
		})

		$("#addTemplateNav").click(function() {
			option = "create";
			_formReset();
			_hideDiv("#addTemplateContent");
			_activeTab("#addTemplateNav");
			window.history.replaceState(null, null, "?menu=create");
		})

		$("#editTemplateNav").click(function() {
			option = "update";
			_formReset();
			_hideDiv("#editTemplateContent");
			_activeTab("#editTemplateNav");
			window.history.replaceState(null, null, "?menu=edit");
			_initCBOTemplate();
		})

		//Get url Parameter
		var _getUrlParameter = function (sParam) {
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
				_hideDiv("#templateListContent");
				_activeTab("#templateListNav");
				_loadTable();
		    } else if( menu == "create" || menu == undefined) {
		    	_hideDiv("#addTemplateContent");
				_activeTab("#addTemplateNav");
		    } else if( menu == "edit" ) {
		    	option = "update";
		    	_hideDiv("#editTemplateContent");
				_activeTab("#editTemplateNav");
		    }
		};
	/******************************************* END UTILITY **************************************************/

	/******************************************* BEGIN TEMPLATE ***********************************************/
		//Reset form
		var _formReset = function() {
			if(option == "create") {
				$("#form-template-create")[0].reset();
				$("select[name='subAccts']").val('').selectpicker('refresh');
			} else {
				$("#form-template-update")[0].reset();
				$("select[name='subAcctsUpdate']").val('').selectpicker('refresh');
				$("#divTemplateDetails").hide(0);
			}
			items = new Array();
			_appendItem();
		}

		//Get CBO Template When click the edit tab
		var _initCBOTemplate = function() {
			$.ajax({
				url : update_cbotemplate_url,
				type: "post",
				success: function(res) {
					_updateTemplateCBO(res);
				}
			})
		}

		//Update value of CBO template
		var _updateTemplateCBO = function(res) {
			var option = "";
		    $("select[name='template']").empty();
		    option += '<option value="" class="text-muted">Select Template</option>';
		    for (var i = 0; i < res.length; i++) {
		        option += '<option value="'+res[i].TemplateID +'">' + res[i].TemplateName + '</option>';
		    }
		    $("select[name='template']").append(option).selectpicker('refresh');
		}

		//Load Templates List
		var _loadTable = function() {
			$.ajax({
				url : fetch_templateslist_url,
				type: "post",
				data: { status : 1 },
				beforeSend: function() {
					_beforeSend();
				},
				complete: function() {
					_complete();
				},
				success:function(res) {
					var output = "";
					$("#tableContent").empty();
					if (res.length > 0) {
						output += '<table class="table table-borderless table-vertical-center responsive">';
						output += '<thead>\
										<tr>\
											<th class="p-0 w-40px"></th>\
											<th class="p-0 min-w-200px"></th>\
											<th class="p-0 min-w-125px"></th>\
											<th class="p-0 min-w-80px"></th>\
											<th class="p-0 min-w-100px"></th>\
										</tr>\
									</thead>\
									<tbody>';
						$.each(res, function(index, value){
							output += '<tr>';

							output += '<td class="pl-0 py-4">\
											<div class="symbol symbol-50 symbol-light">\
												<span class="symbol-label">\
													<img src="../../assets/media/svg/misc/008-infography.svg" class="h-100" alt="user">\
												</span>\
											</div>\
										</td>';

							output += '<td class="pl-0">\
											<span class="text-dark-75 font-weight-bolder d-block font-size-lg">' + value.TemplateName + '</span>\
											<span class="text-muted font-weight-bold">' + value.TemplateDesc + '</span>\
										</td>';

							output += '<td class="pl-0">\
											<span class="text-dark-75 font-weight-bolder d-block font-size-lg">' + value.CreatedAt + '</span>\
											<span class="text-muted font-weight-bold">Created At</span>\
										</td>';

							output += '<td class="pl-0 pr-0">\
											<span class="text-dark-75 font-weight-bolder d-block font-size-lg">' + value.CreatedBy + '</span>\
											<span class="text-muted font-weight-bold">Created By</span>\
										</td>';

							output += '<td class="text-right pr-0">\
											<a type="button" onclick="KTTemplateDetails(' + value.TemplateID + ',' + "'" + value.TemplateDesc + "'" + ')" class="btn btn-icon btn-light btn-hover-primary btn-sm">\
												<span class="svg-icon svg-icon-md svg-icon-primary">\
													<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
													    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
													        <rect x="0" y="0" width="24" height="24"/>\
													        <path d="M10.5,5 L20.5,5 C21.3284271,5 22,5.67157288 22,6.5 L22,9.5 C22,10.3284271 21.3284271,11 20.5,11 L10.5,11 C9.67157288,11 9,10.3284271 9,9.5 L9,6.5 C9,5.67157288 9.67157288,5 10.5,5 Z M10.5,13 L20.5,13 C21.3284271,13 22,13.6715729 22,14.5 L22,17.5 C22,18.3284271 21.3284271,19 20.5,19 L10.5,19 C9.67157288,19 9,18.3284271 9,17.5 L9,14.5 C9,13.6715729 9.67157288,13 10.5,13 Z" fill="#000000"/>\
													        <rect fill="#000000" opacity="0.3" x="2" y="5" width="5" height="14" rx="1"/>\
													    </g>\
													</svg>\
												</span>\
											</a>\
										</td>';

							output += '<td class="text-right pr-0">\
											<a type="button" onclick="KTEditTemplate(' + value.TemplateID + ')" class="btn btn-icon btn-light btn-hover-primary btn-sm">\
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
										</td>';

							output += '</tr>';
						});
						output += '</tbody>';
						output += '</table>';
					} else {
						output += '<center>\
										<label class="font-size-h4 text-danger mb-10">\
											No templates available\
										</label>\
									</center>';
					}
					$("#tableContent").append(output);
				}
			})
		}

		//Click Add
	    $("#btn_add").click(function() {
			_addItem();
		});

		//Click Add
	    $("#btn_add_update").click(function() {
			_addItem();
		});

		//Cbo Template
		$("select[name='template']").change(function() {
			if($(this).val() != "") {
				tid = $(this).val();
				_fetchItems(tid);
			} else {
				_formReset();
				$("#divTemplateDetails").hide(0);
			}
		});

		//Setting up validation in Form
	    var _handleCreateForm = function() {
	        var validation;

	        validation = FormValidation.formValidation(
	            KTUtil.getById('form-template-create'),
	            {
	                fields: {
	                    templateName: {
	                        validators: {
	                            notEmpty: {
	                                message: 'Template name is required'
	                            },
	                            stringLength: {
	                                max:100,
	                                message: 'Maximum of 100 characters only'
	                            }
	                        }
	                    },
	                    templateDesc: {
	                        validators: {
	                            notEmpty: {
	                                message: 'Template Description is required'
	                            },
	                            stringLength: {
	                                max:255,
	                                message: 'Maximum of 1000 characters only'
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

	        //Create Template
	        $("#btn_create").on('click', function(e) {
	            e.preventDefault();

	            validation.validate().then(function(status) {
	                if (status == 'Valid') 
	                {
	                	if( items.length > 0) {
		                	Swal.fire({
			                    title: "Are you sure?",
			                    text: "You want to create this?!",
			                    icon: "warning",
			                    showCancelButton: true,
			                    confirmButtonText: "Yes, create it!",
			                    cancelButtonText: "No, cancel!",
			                    customClass: {
			                       confirmButton: "btn btn-success mt-0"
			                    },
			                    reverseButtons: true
			                }).then(function(result) {
			                    if (result.value) {
			                        var fd = new FormData($("#form-template-create")[0]);
			                        fd.append('items', JSON.stringify(items));
			                        $.ajax({
			                            url : create_template_url,
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
			                                    forSwal("Successfully Saved", "success", "btn-success");
			                                    items = new Array();
			                                    _formReset();
										        _appendItem();
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
		            	} else {
		            		forSwal("Please add sub account.",  "error", "btn-danger");
		            		$("select[name='subAccts']").focus();
		            	}
	                }
            	});

	        })

	        $("#btn_cancel").click(function() {
	        	validation.resetForm();
	        	_formReset();
	        })
	    };

	    //Setting up validation in Form
	    var _handleUpdateForm = function() {
	        var validation;

	        validation = FormValidation.formValidation(
	            KTUtil.getById('form-template-update'),
	            {
	                fields: {
	                    templateName: {
	                        validators: {
	                            notEmpty: {
	                                message: 'Template name is required'
	                            },
	                            stringLength: {
	                                max:100,
	                                message: 'Maximum of 100 characters only'
	                            }
	                        }
	                    },
	                    templateDesc: {
	                        validators: {
	                            notEmpty: {
	                                message: 'Template Description is required'
	                            },
	                            stringLength: {
	                                max:255,
	                                message: 'Maximum of 1000 characters only'
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

	        //Create Template
	        $("#btn_update").on('click', function(e) {
	            e.preventDefault();

	            validation.validate().then(function(status) {
	                if (status == 'Valid') 
	                {
	                	if( items.length > 0) {
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
			                        var fd = new FormData($("#form-template-update")[0]);
			                        fd.append('items', JSON.stringify(items));
			                        fd.append('id', tid);
			                        $.ajax({
			                            url : update_template_url,
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
			                                if(typeof res != 'string') {
			                                    forSwal("Successfully Updated", "success", "btn-success");
			                                    items = new Array();
			                                    _updateTemplateCBO(res);
			                                    _formReset();
										        _appendItem();
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
		            	} else {
		            		forSwal("Please select template.",  "error", "btn-danger");
		            	}
	                }
	                else 
	                {
	                    forSwal("Sorry, looks like there are some errors detected, please try again.", 
	                                    "error", "btn-danger");
	                }
            	});

	        })

	        $("#btn_cancel_update").click(function() {
	        	validation.resetForm();
	        	_formReset();
	        })
	    };
	/******************************************* END TEMPLATE *************************************************/

	return {
		// public functions
		init: function () {
			_getUrlParameter("menu");
			_handleCreateForm();
			_handleUpdateForm();
			$("#divTemplateDetails").hide(0);
		}
	};
}();

jQuery(document).ready(function () {
	KTTemplates.init();
});
