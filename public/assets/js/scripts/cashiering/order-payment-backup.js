"use strict";

var items      	  = new Array();
var table;
var total_amount  = 0;
var option 		  = "create";
var opid          = "";
var tempOrNo      = "";

menuActive('li-menu-cashiering', 'li-submenu-cashiering-or');


//Fetch Details
var KTTemplatesDetails = function(id, acctTitle) {
	$("#chartOfAcctSpan").text(acctTitle);
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
        	output += "<div class='row'>";
        	for (var i = 0; i < res.length; i++) {
        		output  += "<div class='col-lg-4'><span class='label label-dot label-dark mr-2'></span>"    + res[i].SubAcctTitle + "</div>";
        		output  += "<div class='col-lg-8 mb-2'> ₱ " + res[i].Amount + " x " + parseInt(res[i].Qty) + "</div>";
        	}
        	output += "</div>";
        	$("#subAcctsDetails").append(output);
        	$("#templateDetailsModal").modal('show');
        }, 
        error:function(a,b,c)
        {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    })
}

//Select Template
var KTSelectTemplate = function(id) {

	$.ajax({
		url: fetch_single_template_url,
		type: "post",
		data: {"id": id},
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
						'amount': item.Amount
					};
					items.push(data);
				});
				_appendItem();
				$("#templateModal").modal('hide');
			}
		},
		error:function(a,b,c)
        {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
	})
}

//Mark as Paid
var KTMarkAsPaid = function(id) {
	_fetchORNO();
	var orNo = $("input[name='orNo']").val();
	if(orNo == "") {
		Swal.fire({
    		title: "Failed",
    		icon:  "error",
		  	text:  "No remaining O.R. Series.",
		  	confirmButtonText: "Ok, Got it",
	        customClass: {
	            confirmButton: "btn font-weight-bold btn-danger"
	        }
		});
	} else {
		$("#modalORNO").val(orNo);
		$("#markAsPaidModal").modal('show');
	}

	var validation;

    validation = FormValidation.formValidation(
        KTUtil.getById('form-markaspaid'),
        {
            fields: {
                modalORNO: {
                    validators: {
                        notEmpty: {
                            message: 'OR NO. is required'
                        },
                        stringLength: {
                            max:45,
                            message: 'Maximum of 45 characters only'
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

    $("#modalORNO").focus();
	
    $("#btn_paid").on('click', function(e) {
        e.preventDefault();

        validation.validate().then(function(status) {
            if (status == 'Valid') 
            {
                Swal.fire({
			        title: "Are you sure?",
			        text: "You want to mark this as Paid?!",
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
			            $.ajax({
			                url : create_trans_url,
			                data: {
			                	"transType" : 2,
			                	"orNo" : $("input[name='modalORNO']").val(), 
			                	"id"   : id
			                },
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
			                		table.ajax.reload();
			                		Swal.fire({
								        title: "Successfully Updated!",
								        text: "Please wait for the receipt.",
								        timer: 1000,
								        onOpen: function() {
								            Swal.showLoading()
								        }
								    }).then(function(result) {
								        if (result.dismiss === "timer") {
								        	$("#form-markaspaid")[0].reset();
								        	$("#markAsPaidModal").modal('hide');
								        	_printReceipt(res[1], $("input[name='orNo']").val());
								        }
								    })
			                    }
	                    	    else if ( res == "or_no_exists") {
	                            	forSwal("Failed. O.R NO. is already used.", "error", "btn-danger");
	                            }

	                            else if (res == "no_orseries_balance") {
	                            	forSwal("Failed. No remaining O.R. Series.", "error", "btn-danger");
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
}

//View Details
var KTViewDetails = function(id, status) {
	$.ajax({
        url : fetch_orderpaymentdetails_url,
        type: "POST",
        data: {"id": id},
        beforeSend: function(){
        	_beforeSend();
        },
        complete: function() {
        	_complete();
        },
        success:function(res) {
        	if(res != "not_found") {
        		$("#orderPaymentDetails").empty();
	        	var output = "";
	        	var total = res[0].TotalAmount;
	        	output += "<div class='row'>";
	        	for (var i = 0; i < res.length; i++) {
	        		output  += "<div class='col-lg-4'><span class='label label-dot label-dark mr-2'></span>"    + res[i].SubAcctTitle + "</div>";
	        		output  += "<div class='col-lg-8 mb-2'> ₱ " + res[i].Amount + " x " + parseInt(res[i].Qty) + "</div>";
	        	}
	        	output += "</div>";
	        	output += "<div class='col-lg-12 separator separator-solid mb-2'></div>";
	        	$("#optotal_amount").text(total);
	        	$("#orderPaymentDetails").append(output);

	        	if(status == 1) {
	        		$("#divProcessDate").show(0);
	        		$("#orderPaymentProcessDate").text(res[0].ProcessDate);
	        	} else {
	        		$("#divProcessDate").hide(0);
	        	}
	        	
	        	$("#orderPaymentDetailsModal").modal('show');
        	} else {
        		forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        	}
        }, 
        error:function(a,b,c)
        {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    });
}

//Edit Details
var KTEditDetails = function(id) {
	option = "update";
	opid   = id;
	$.ajax({
		url: fetch_orderpaymentdetails_url,
		type: "post",
		data: {"id": id},
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
						'amount': item.Amount
					};
					items.push(data);
				});
				$("input[name='recipientNameUpdate']").val(res[0].RecipientName);
				$("#editDetailsModal").modal('show');
				_appendItem();
			}
		},
		error:function(a,b,c)
        {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
	})
}

//Append Item in Div
var _appendItem = function() {
	var div, input, span, button, output = "";

	if(option == "create") {
		div    = $("#divItems");
		input  = $("input[name='recipientName']").val();
		span   = $("#total");
		button = $("#btn_submit"); 
	} else {
		div    = $("#divItemsUpdate");
		input  = $("input[name='recipientNameUpdate']").val();
		span   = $("#totalUpdate");
		button = $("#btn_update");
	}

	div.empty();

	if(items.length > 0 ) {

		_generatePDF(true, input);
		if( input != "") { button.prop('disabled', false); }

		$.each(items, function(index, item){
			output += '\
				<div class="col-lg-9 mt-5">\
					' + item.title + ' <br>\
					<label class="font-weight-bolder">\
						₱ <span>'+ item.amount +'</span> x <span> '+ item.qty +' </span>\
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

		_generatePDF(false);
		button.prop('disabled', true);

		output += "<div class='col-lg-12'><center class='text-danger'>No item Available</center></div>";
	}
	
	span.text(_computeTotal().toFixed(2));
	div.append(output);
}

//Print Receipt of Mark as Paid
var _printReceipt = function( id, orNo ) {
	$.ajax({
		url : fetch_orderpaymentdetails_url,
		type: "post",
		data: {"id": id},
		success:function(res) {
			if(res == "not_found") {
				forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
			} else {
				/******RECEIPT********/
					var or = new jsPDF();

					or.setProperties({
					    title: "Receipt",
					    author: "Cabuyao Government",
					    keywords: "generated, javascript, web 2.0, ajax",
					});

					or.setFontSize(12);
					or.setFont('courier')
					or.setFontType('normal')
					or.text(20, 40, dateToday);

					or.setFontSize(15);
					or.setFont('courier')
					or.setFontType('normal')
					or.text(20, 55, res[0].RecipientName.toUpperCase());

					var y = 75;
					var titleSize = 20;

					$.each( res, function(index, item ){
						var arr_title = item.SubAcctTitle.split(" - ");

						if(arr_title.length > 1) {
							titleSize = 11;
						} else {
							titleSize = 15;
						}
						or.setFontSize(titleSize);
						or.setFont('courier')
						or.setFontType('normal')
						or.text(20, y, item.SubAcctTitle + "(" + parseInt(item.Qty) + ")");

						or.setFontSize(15);
						or.setFont('courier')
						or.setFontType('normal')
						or.text(160, y, parseInt(item.Amount).toString());

						y += 10;
					});

					or.setFontSize(15);
					or.setFont('courier')
					or.setFontType('normal')
					or.text(20, 110, "O.R. #"+ orNo);

					or.setFontSize(15);
					or.setFont('courier')
					or.setFontType('normal')
					or.text(160, 130, parseInt(res[0].TotalAmount).toString());

					or.setFontSize(15);
					or.setFont('courier')
					or.setFontType('normal')
					or.text(20, 150, _numberToWords(parseInt(res[0].TotalAmount).toString()).toUpperCase() + " PESOS");

					or.setFontSize(15);
					or.setFont('courier')
					or.setFontType('normal')
					or.text(160, 170, "AGENT");
					or.autoPrint();
					$('#docpdfList').attr('src', or.output('datauristring') + '#toolbar=0');
				/******RECEIPT********/
			}
		},
		error:function(a,b,c)
        {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
	})
}

//Generate PDF
var _generatePDF = function(bool, recipientName = "", print = "") {

	if(option == "create") {
		$("#noImageDiv").prop('hidden', bool);
		$("#previewDiv").prop('hidden', !bool);
	} else {
		$("#noImageDivUpdate").prop('hidden', bool);
		$("#previewDivUpdate").prop('hidden', !bool);
	}


	recipientName = (recipientName == "") ? "'recipient here'" : recipientName;
	print = (print == "") ? false : print;

	if(bool) {

		var doc = new jsPDF();

		doc.setProperties({
		    title: "Receipt",
		    author: "Cabuyao Government",
		    keywords: "generated, javascript, web 2.0, ajax",
		});

		doc.setFontSize(12);
		doc.setFont('courier')
		doc.setFontType('normal')
		doc.text(20, 40, dateToday);

		doc.setFontSize(15);
		doc.setFont('courier')
		doc.setFontType('normal')
		doc.text(20, 55, recipientName.toUpperCase());

		var y = 75;
		var titleSize = 20;

		$.each( items, function(index, item ){
			var arr_title = item.title.split(" - ");

			if(arr_title.length > 1) {
				titleSize = 11;
			} else {
				titleSize = 15;
			}
			doc.setFontSize(titleSize);
			doc.setFont('courier')
			doc.setFontType('normal')
			doc.text(20, y, item.title + "(" + item.qty + ")");

			doc.setFontSize(15);
			doc.setFont('courier')
			doc.setFontType('normal')
			doc.text(160, y, item.amount.toString());

			y += 10;
		});

		if( print ) {
			doc.setFontSize(15);
			doc.setFont('courier')
			doc.setFontType('normal')
			doc.text(20, 110, "O.R. #"+ $("input[name='orNo']").val());
		}

		doc.setFontSize(15);
		doc.setFont('courier')
		doc.setFontType('normal')
		doc.text(160, 130, _computeTotal().toFixed(2).toString());

		doc.setFontSize(15);
		doc.setFont('courier')
		doc.setFontType('normal')
		doc.text(20, 150, _numberToWords(_computeTotal()).toUpperCase() + " PESOS");

		doc.setFontSize(15);
		doc.setFont('courier')
		doc.setFontType('normal')
		doc.text(160, 170, "AGENT");

		if( print ) {
			doc.autoPrint();
		}

		if(option == "create") {
			$('#docpdf').attr('src', doc.output('datauristring') + '#toolbar=0');
		} else {
			$('#docpdfUpdate').attr('src', doc.output('datauristring') + '#toolbar=0');
		}
	}
}

//Convert Total Amount to Words
var _numberToWords = function(number) {  
    var digit 		   = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];  
    var elevenSeries   = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];  
    var countingByTens = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];  
    var shortScale 	   = ['', 'thousand', 'million', 'billion', 'trillion'];  
    number = number.toString(); 
    number = number.replace(/[\, ]/g, ''); 
    if (number != parseFloat(number)) 
    	return 'not a number'; 
    var x = number.indexOf('.'); 
    if (x == -1) x = number.length; 
    if (x > 15) 
    	return 'too big'; 
    var n = number.split(''); 
    var str = ''; 
    var sk = 0; 
    for (var i = 0; i < x; i++) { 
    	if ((x - i) % 3 == 2) { 
    		if (n[i] == '1') { 
    			str += elevenSeries[Number(n[i + 1])] + ' '; 
    			i++; 
    			sk = 1; 
    		} else if (n[i] != 0) { 
    			str += countingByTens[n[i] - 2] + ' '; 
    			sk = 1; 
    		} 
    	} 
    	else if (n[i] != 0) { 
    		str += digit[n[i]] + ' '; 
    		if ((x - i) % 3 == 0) str += 'hundred '; 
    		sk = 1; 
    	} if ((x - i) % 3 == 1) { 
    		if (sk) str += shortScale[(x - i - 1) / 3] + ' '; 
    		sk = 0; 
    	} 
    } 
    if (x != number.length) { 
    	var y = number.length; str += 'point '; 
    	for (var i = x + 1; i < y; i++) 
    		str += digit[n[i]] + ' '; 
    } 
    str = str.replace(/\number+/g, ' '); 
    return str.trim();
} 

//Compute Total
var _computeTotal = function() {
	var total = 0;
	$.each(items, function(index, item) {
		total += (item.amount * item.qty);
	});
	return total;
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

//Fetch OR NO;
var _fetchORNO = function() {
	$.ajax({
		url : fetch_orno_url,
		processData: false,
		contentType: false,
		type: "post",
		success:function(res) {
			var balance = 0;
			var count   = 0;
			var begin   = 0;
			var diff    = 0; // Difference of Count & Balance
			var orNo    = "";
			if( res.length > 0 ) {
				balance = res[0].Balance; 
				count   = res[0].Count;
				begin   = res[0].Beginning;
				diff    = count - balance;
				orNo    = begin + diff;
				if( diff == 0) {
					$("input[name='orNo']").val(begin);
				} else {
					$("input[name='orNo']").val(orNo);
				}
			} else {
				$("input[name='orNo']").val('');
			}
		},
		error: function(a,b,c) {
			forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
		}
	});
}

// Class definition
var KTOrderOfPayment = function () {

	//Set Up Ajax CSRF
	$.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

	//Click Add
    $("#btn_add").click(function() {
		_addItem();
	});

	//Click Add
    $("#btn_add_update").click(function() {
		_addItem();
	});

	//Prevent Numbers in Name
	$("input[name='recipientName']", "input[name='recipientNameUpdate']").keypress(function(e) {
	    e = e || window.event;
	    var charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
	    var charStr = String.fromCharCode(charCode);
	    if (/\d/.test(charStr)) {
	        return false;
	    }
	});

	//Recipient Name on keyup 
	$("input[name='recipientName']").keyup(function(){
		var recipientName = $(this).val();
		if(recipientName != "" && items.length > 0) {
			$("#btn_submit").prop('disabled', false);
			_generatePDF(true, recipientName);
		}
		else {
			$("#btn_submit").prop('disabled', true);
			_generatePDF(false, recipientName);
		}
	});

	//Recipient Name on keyup 
	$("input[name='recipientNameUpdate']").keyup(function(){
		var recipientName = $(this).val();
		if(recipientName != "" && items.length > 0) {
			$("#btn_update").prop('disabled', false);
			_generatePDF(true, recipientName);
		}
		else {
			$("#btn_update").prop('disabled', true);
			_generatePDF(false, recipientName);
		}
	});

	//Cancel
	$("#btn_cancel").click(function(){
		_formReset();
	});

	//Cancel
	$("#btn_cancel_update").click(function(){
		_formReset();
	});

	//Order payment list
	$("#orderPaymentListMenu").click(function(){
		_toggleAction("#orderPaymentListMenu");
		_loadTable();
		table.column(5).search($("#cboStatus").val(), false, false).draw();
		window.history.replaceState(null, null, "?action=list");
	});

	//Order payment create
	$("#orderPaymentCreateMenu").click(function(){
		option = "create";
		_toggleAction("#orderPaymentCreateMenu");
		_formReset();
		window.history.replaceState(null, null, "?action=create");
	});

	//Cbo Status
	$("#cboStatus").change(function(){
		var val = $(this).val();
		table.column(5).search($(this).val(), false, false).draw();	
	});

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
				success:function(res) {
					if(res == "not_found") {
						forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
					} else {
						var found = false;
						var data = {
							"id"    : subAcct.val(),
							"qty"   : 1,
							'title' : res.SubAcctTitle,
							'amount': res.Amount
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
		} else {
			var content = {};
			content.message = 'Please select account.';
			$.notify(content, {
                type: "danger",
                allow_dismiss: true,
                newest_on_top: true,
                mouse_over:  false,
                showProgressbar:  false,
                spacing: 10,
                timer: 2000,
                placement: {
                    from: "top",
                    align: "right"
                },
                offset: {
                    x: 30,
                    y: 30
                },
                delay: 1000,
                z_index: 10000,
                animate: {
                    enter: 'animate__animated animate__pulse',
                    exit: 'animate__animated animate__bounce'
                }
            });
		}
	}

	//Reset form
	var _formReset = function() {
		if(option == "create") {
			$("#form-orderofpayment")[0].reset();
			$("select[name='subAccts']").val('').selectpicker('refresh');
		} else {
			$("#form-orderofpayment-update")[0].reset();
			$("select[name='subAcctsUpdate']").val('').selectpicker('refresh');
		}

		_fetchORNO();
		_generatePDF(false);
		items = new Array();
		_appendItem();
	}

	//Toggle Action For Action Button - List / Create
	var _toggleAction = function(menu) {
		$(".dropdown-item").removeClass('active');
		$(menu).addClass("active");
		if(menu == "#orderPaymentListMenu") {
			$("#orderPaymentListContent").show(0);
			$("#orderPaymentCreateContent").hide(0);
		} else {
			$("#orderPaymentListContent").hide(0);
			$("#orderPaymentCreateContent").show(0);
		}
	}

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
			_toggleAction("#orderPaymentListMenu");
			_loadTable();
	    } else {
	    	_toggleAction("#orderPaymentCreateMenu");
	    }
	};

	//Setting up validation in Form
    var _handleCreateForm = function() {
        var validation;    
		var opType = ( $("input[name='paid']").is(":checked") ) ? "<span class='text-success'> PAID </span>" : "<span class='text-danger'> UNPAID </span>";
		var createMsg = "<b>You want to create"+ opType +"order payment?!</b>";

        validation = FormValidation.formValidation(
            KTUtil.getById('form-orderofpayment'),
            {
                fields: {
                    recipientName: {
                        validators: {
                            notEmpty: {
                                message: 'Recipient Name is required'
                            },
                            stringLength: {
                                max:45,
                                message: 'Maximum of 45 characters only'
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

        //CheckBox Toggle
		$("input[name='paid'").click(function(){
			if($(this).is(':checked')) {
				createMsg = "<b>You want to create <span class='text-success'> PAID </span> order payment?!</b>";
				$("input[name='orNo']").prop('disabled', false).focus();
			} else {
				$("input[name='orNo']").prop('disabled', true);
				createMsg = "<b>You want to create <span class='text-danger'> UNPAID </span> order payment?!</b>";
			}
		})

        //Save
        $("#btn_submit").on('click', function(e) {
            e.preventDefault();

            validation.validate().then(function(status) {
                if (status == 'Valid' && items.length > 0) 
                {
                	var isValid = true;
                	if($("input[name='paid'").is(':checked')) {
                		if ($("input[name='orNo']").val() == ""){
                			isValid = false;
                		} else {
                			isValid = true;
                		}
                	}
                	if( isValid ) 
                	{
	                    Swal.fire({
	                        title: "Are you sure?",
	                        html: createMsg,
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
	                        	var fd = new FormData($("#form-orderofpayment")[0]);
			                    var paid = ($("input[name='paid']").is(':checked')) ? 1 : 0;
			                    fd.append('transType', 1);
			                    fd.append('items', JSON.stringify(items));
			                    fd.append('paid', paid);
			                    $.ajax({
			                        url : create_trans_url,
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
			                        		Swal.fire({
										        title: "Successfully Saved!",
										        text: "Please wait.",
										        timer: 1000,
										        onOpen: function() {
										            Swal.showLoading()
										        }
										    }).then(function(result) {
										        if (result.dismiss === "timer") {
									        		_generatePDF(true, $("input[name='recipientName']").val(), true);
										            _formReset();
										            items = new Array();
										            _appendItem();
										            
									        		if(res[0] == "success") {
										        		$("input[name='orNo']").val(res[1]);
										            } else {
										            	$("input[name='paid']").prop("checked", false);
										            	$("input[name='paid']").prop("disabled", true);
										            	$(".checkbox").addClass('checkbox-disabled');
										            	$("#noLeftMsg").prop('hidden', false);
										            	$("input[name='orNo']").prop("disabled", true).val('');
										            	createMsg = "<b>You want to create <span class='text-danger'> UNPAID </span> order payment?!</b>";
										            }
										        }
										    })
			                            } 

			                            else if ( res == "success" ) {
			                            	forSwal("Order Payment has been successfully created.", "success", "btn-success");
			                            	_formReset();
								            items = new Array();
								            _appendItem();
			                            	$("#orderPaymentListMenu").click();
			                            }

			                            else if ( res == "or_no_exists") {
			                            	forSwal("Failed. O.R NO. is already used.", "error", "btn-danger");
			                            }

			                            else if (res == "no_orseries_balance") {
			                            	Swal.fire({
			                            		title: "Failed",
			                            		icon: "error",
											  	text: 'No remaining O.R. Series.'
											}).then(function(result) {
										        if (result.value) {
										            location.reload();
										        }
										    });
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

                    	Swal.fire({
					        title: "Failed!",
					        icon: "error",
					        text: "Please input OR NO.",
					        buttonsStyling: false,
					        confirmButtonText: "Ok",
					        customClass: {
					            confirmButton: "btn btn-danger font-weight-bold"
					        }
					    }).then(function(result) {
                    		$("input[name='orNo']").focus();
					    })
                    }
                }
                else 
                {
                    forSwal("Sorry, looks like there are some errors detected, please try again.", "error", "btn-danger");
                }
            });
        })
    };

    //Setting up validation in Form
    var _handleUpdateForm = function() {
        var validation;

        validation = FormValidation.formValidation(
            KTUtil.getById('form-orderofpayment-update'),
            {
                fields: {
                    recipientNameUpdate: {
                        validators: {
                            notEmpty: {
                                message: 'Recipient Name is required'
                            },
                            stringLength: {
                                max:45,
                                message: 'Maximum of 45 characters only'
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
        $("#btn_update").on('click', function(e) {
            e.preventDefault();

            validation.validate().then(function(status) {
                if (status == 'Valid' && items.length > 0) 
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
                        	var fd = new FormData($("#form-orderofpayment-update")[0]);
		                    //var paid = ($("input[name='paid']").is(':checked')) ? 1 : 0;
		                    fd.append('transType', 4);
		                    fd.append('items', JSON.stringify(items));
		                    fd.append('id', opid);
		                    $.ajax({
		                        url : create_trans_url,
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
		                        	if(res == 'success') {
		                        		Swal.fire({
									        title: "Successfully Updated!",
									        text: "Please wait.",
									        timer: 1000,
									        onOpen: function() {
									            Swal.showLoading()
									        }
									    }).then(function(result) {
									        if (result.dismiss === "timer") {
                        						table.ajax.reload();
									            items = new Array();
									            _formReset();
									            _appendItem();
									            $("#editDetailsModal").modal('hide');
									        }
									    })
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
        })
    };

    //Load DataTable
    var _loadTable = function() {

    	if( table ) { 
    		table.clear();
    		table.destroy(); 
    	}

        table = $('#tbl_orderpayment').DataTable({
        	responsive: true,
            processing: true,
            serverSide: true,
            language: {                
	            infoFiltered: ""
	        },
            ajax: {
                method : "POST",
                url    : fetch_orderpaymentlist_url,
                data: {
					columnsDef: ['DT_RowIndex', 'TransCode', 'RecipientName',
						'CreatedAt', 'CreatedBy',
						'Status', null, "Action"],
				},
            },
            columns: [
            	{data: 'DT_RowIndex'},
				{data: 'TransCode'},
				{data: 'RecipientName'},
				{data: 'CreatedAt'},
				{data: 'CreatedBy'},
				{data: 'Status'},
				{data: null},
				{data: "Action", orderable: false, searchable: false},
			],
            columnDefs: [
                {   
                    targets: 5,
                    render: function( data, type, row ) {
                        var status = {
							0: {'title': 'Unprocess', 'class': 'label-light-danger'},
							1: {'title': 'Processed', 'class': ' label-light-primary'},
						};
					
						return '<span class="label ' + status[row.Status].class + ' label-inline font-weight-bold label-lg">' + status[row.Status].title + '</span>';
                    }
                },
                {   
                    targets: 6,
                    title: "Total Amount",
                    render: function( data, type, row ) {
						return "₱ " + row.TotalAmount;
                    }
                },
                
            ]
        });
    };

	return {
		// public functions
		init: function () {

			$("#cboStatus").selectpicker();
			_generatePDF(false);
			_handleCreateForm();
			_handleUpdateForm();
			_getUrlParameter("action");

			if ( table ) { table.column(5).search($("#cboStatus").val(), false, false).draw(); }
			$("select[name='subAccts']").selectpicker();
			$("select[name='subAcctsUpdate']").selectpicker();
			$("#btn_submit").prop('disabled', true);
			$("#btn_update").prop('disabled', true);
		}
	};

}();

jQuery(document).ready(function () {
	KTOrderOfPayment.init();
});