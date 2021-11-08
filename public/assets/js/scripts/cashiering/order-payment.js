"use strict";

var items      	  = new Array();
var table;
var total_amount  = 0;
var option 		  = "create";
var createType	  = "unpaid";
var opid          = "";
var tempOrNo      = "";
var _enc          = 1;

menuActive('li-menu-cashiering', 'li-submenu-cashiering-or');


//Fetch Details
var KTTemplatesDetails = function(id, acctTitle) {
	$("#chartOfAcctSpan").text(acctTitle);
	$.ajax({
        url : fetch_template_details_url,
        type: "POST",
        data: {"id": id},
        success:function(res) {
        	var table = $("#tblTemplateSubAcct tbody");
            var rd = "";
            var total = 0;

            $.each(res, function(index, value){
                var code   = (value.SubAcctCode) ? value.SubAcctCode : "--";
                total += (value.Qty * value.Amount);
                rd += "<tr>";
                rd += "<td class='pt-1 pb-1'>" + code + "</td>";
                rd += "<td class='pt-1 pb-1 font-size-sm'>" + value.SubAcctTitle + "</td>";
                rd += "<td class='pt-1 pb-1'>" + parseInt(value.Qty) + "</td>";
                rd += "<td class='text-right pt-1 pb-1'> ₱ " + _addComma(parseFloat(value.Amount).toFixed(2)) + "</td>";
                rd += "</tr>";
            });

        	rd += "<tr>";
            rd += "<td class='pt-1 pb-1'>&nbsp;</td>";
            rd += "<td class='pt-1 pb-1'>&nbsp;</td>";
            rd += "<td class='pt-1 pb-1 font-weight-bolder'>Total</td>";
            rd += "<td class='text-right pt-1 pb-1'> ₱ " + _addComma(parseFloat(total).toFixed(2)) + "</td>";
            rd += "</tr>";
            table.empty();
            table.append(rd);
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
		beforeSend: function() {			
			KTApp.block('#divSummary', {
			  	overlayColor: '#000000',
			  	state: 'danger',
			  	message: 'Please wait...'
			});
		},
		complete: function() {
			KTApp.unblock('#divSummary');
		},
		success:function(res) {
			if(res == "not_found") {
				forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
			} else {
				items = new Array();
				_enc = 0;
				$("#btn_add").prop('disabled', true);
				$.each(res, function(index, item){
					var data = {
						"id"    : item.SubAcctID,
						"qty"   : parseInt(item.Qty),
						'title' : item.SubAcctTitle,
						'amount': parseFloat(item.Amount).toFixed(2)
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

//View Details
var KTViewDetails = function(id, status) {
	$.ajax({
        url : fetch_orderpaymentdetails_url,
        type: "POST",
        data: {"id": id},
        /*beforeSend: function(){
        	_beforeSend();
        },
        complete: function() {
        	_complete();
        },*/
        success:function(res) {
        	if(res != "not_found") {
        		var table = $("#tblSubAcct tbody");
                var rd = "";
                var total = 0;

                $.each(res, function(index, value){
                    var code   = (value.SubAcctCode) ? value.SubAcctCode : "--";
                    total += (value.Qty * value.Amount);
                    rd += "<tr>";
                    rd += "<td class='pt-1 pb-1'>" + code + "</td>";
                    rd += "<td class='pt-1 pb-1 font-size-sm'>" + value.SubAcctTitle + "</td>";
                    rd += "<td class='pt-1 pb-1'>" + parseInt(value.Qty) + "</td>";
                    rd += "<td class='text-right pt-1 pb-1'> ₱ " + _addComma(parseFloat(value.Amount).toFixed(2)) + "</td>";
                    rd += "</tr>";
                });

                rd += "<tr>";
                rd += "<td class='pt-1 pb-1'>&nbsp;</td>";
                rd += "<td class='pt-1 pb-1'>&nbsp;</td>";
                rd += "<td class='pt-1 pb-1 font-weight-bolder'>Total</td>";
                rd += "<td class='text-right pt-1 pb-1'> ₱ " + _addComma(parseFloat(total).toFixed(2)) + "</td>";
                rd += "</tr>";
                table.empty();
                table.append(rd);

        		/*$("#orderPaymentDetails").empty();
	        	var output = "";
	        	var total  = parseFloat(res[0].TotalAmount).toFixed(2);
	        	output += "<div class='row'>";
	        	for (var i = 0; i < res.length; i++) {
	        		var amount = _addComma(parseFloat(res[i].Amount).toFixed(2))
	        		output  += "<div class='col-lg-4'><span class='label label-dot label-dark mr-2'></span>"    + res[i].SubAcctTitle + "</div>";
	        		output  += "<div class='col-lg-8 mb-2'> ₱ " + amount + " x " + parseInt(res[i].Qty) + "</div>";
	        	}
	        	output += "</div>";
	        	output += "<div class='col-lg-12 separator separator-solid mb-2'></div>";
	        	$("#optotal_amount").text(_addComma(total));
	        	$("#orderPaymentDetails").append(output);

	        	if(status == 1) {
	        		$("#divProcessDate").show(0);
	        		$("#orderPaymentProcessDate").text(res[0].ProcessDate);
	        	} else {
	        		$("#divProcessDate").hide(0);
	        	}*/
	        	
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
		beforeSend: function() {
			_beforeSend();
		},
		complete: function() {
			_complete();
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

//Fetch OR NO;
var KTFetchORNO = function() {
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
					$("#spanORNum").text(begin);
				} else {
					$("#spanORNum").text(orNo);
				}
			} else {
				$("#spanORNum").text('---');
			}
		},
		error: function(a,b,c) {
			forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
		}
	});
}

//Append Item in Div
var _appendItem = function() {
	var div, input, span, button, output = "";

	if(option == "create") {
		div    = $("#divItems");
		input  = (createType == "unpaid") ? $("input[name='recipientName']").val() : $("input[name='recipientNamePaid']").val();
		span   = $("#total");
		button = (createType == "unpaid") ? $("#btn_submit") : $("#btn_submit_paid");
	} else {
		div    = $("#divItemsUpdate");
		input  = $("input[name='recipientNameUpdate']").val();
		span   = $("#totalUpdate");
		button = $("#btn_update");
	}

	div.empty();

	if(items.length > 0 ) {

		if( input != "") { button.prop('disabled', false); }

		$.each(items, function(index, item){
			output += '\
				<div class="col-lg-9 mt-5">\
					' + item.title + ' <br>\
					<label class="font-weight-bolder">\
						₱ <span>'+ _addComma(item.amount) +'</span> x <span> '+ item.qty +' </span>\
					</label>\
				</div>\
				<div class="col-lg-3 mt-5">\
					<button type="button" class="btn btn-sm btn-success mr-2" onclick="_addQty('+index+')"> + </button>\
					<button type="button" class="btn btn-sm btn-danger" onclick="_subQty('+index+')"> - </button>\
				</div>\
				<div class="col-lg-9"> &nbsp; </div>\
				<div class="col-lg-12 separator separator-primary separator-dashed"></div>';
		});

		if( option == "create") {
			$("#divNoItems").hide(0);
			$("#divHasItems").show(0);
			$("#divButtons").show(0); 
			if( createType == "unpaid" ) {
				$("#paidButtons").hide(0);
				$("#unpaidButtons").show(0);
			} else {
				$("#unpaidButtons").hide(0);
				$("#paidButtons").show(0);
			}
		} else {
			$("#divNoItemsUpdate").hide(0);
			$("#divHasItemsUpdate").show(0);
		}
		
	} else {
		button.prop('disabled', true);
		if( option == "create") {
			$("#divNoItems").show(0);
			$("#divHasItems").hide(0);
			$("#divButtons").hide(0);
		} else {
			$("#divNoItemsUpdate").show(0);
			$("#divHasItemsUpdate").hide(0);
		}
		output += "<div class='col-lg-12'><center class='text-danger'>No item Available</center></div>";
	}
	
	span.text(_addComma(_computeTotal().toFixed(2)));
	div.append(output);
}

//Print Receipt
var _printReceipt = function( orNo ) {
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
    or.text(20, 55, $("input[name='recipientNamePaid']").val().toUpperCase());

    var y = 75;
    var titleSize = 20;

    $.each( items, function(index, item ){
        var arr_title = item.title.split(" - ");

        if(arr_title.length > 1) {
            titleSize = 11;
        } else {
            titleSize = 15;
        }
        or.setFontSize(titleSize);
        or.setFont('courier')
        or.setFontType('normal')
        or.text(20, y, item.title + "(" + parseInt(item.qty) + ")");

        or.setFontSize(15);
        or.setFont('courier')
        or.setFontType('normal')
        or.text(160, y, parseInt(item.amount).toFixed(4).toString());

        y += 10;
    });

    or.setFontSize(15);
    or.setFont('courier')
    or.setFontType('normal')
    or.text(20, 110, "O.R. #"+ orNo);

    or.setFontSize(15);
	or.setFont('courier')
	or.setFontType('normal')
	or.text(160, 130, _computeTotal().toFixed(4).toString());

	or.setFontSize(15);
	or.setFont('courier')
	or.setFontType('normal')
	or.text(20, 150, _numberToWords(_computeTotal()).toUpperCase() + " PESOS");

    or.setFontSize(15);
    or.setFont('courier')
    or.setFontType('normal')
    or.text(160, 170, agent.toUpperCase());
    or.autoPrint();
    $('#docpdfList').attr('src', or.output('datauristring') + '#toolbar=0');
}

//Generate PDF
var _generatePDF = function(bool, recipientName = "", orNo = "") {
	if(option == "create") {
		$("#previewDiv").prop('hidden', !bool);
	} else {
		$("#previewDivUpdate").prop('hidden', !bool);
	}

	recipientName = (recipientName == "") ? "'recipient here'" : recipientName;

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

		if( orNo != "" ) {
			doc.setFontSize(15);
			doc.setFont('courier')
			doc.setFontType('normal')
			doc.text(20, 110, "O.R. #"+ orNo);
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
		doc.text(160, 170, agent);
		if(option == "create") {
			$('#docpdf').attr('src', doc.output('datauristring') + '#toolbar=0');
		} else {
			$('#docpdfUpdate').attr('src', doc.output('datauristring') + '#toolbar=0');
		}
	}
}

//Add Comma
var _addComma = function(val) {
	while (/(\d+)(\d{3})/.test(val.toString())){
	  val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	}
	return val;
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

// Class definition
var KTOrderOfPayment = function () {

	//Set Up Ajax CSRF
	$.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $("#viewTemplates").click(function(){
    	$("#templateModal").modal({
    		//'show',
    		backdrop: 'static',
   			keyboard: false
    	});
    })

    $("#btn_close_template").click(function(){
    	$("#templateModal").modal('hide');
    })

	//Click Add
    $("#btn_add").click(function() {
		_addItem();
	});

	$("#btn_add_paid").click(function () {
		_addItem();
	})

	//Click Add
    $("#btn_add_update").click(function() {
		_addItem();
	});

	//Prevent Numbers in Name
	$("input[name='recipientName'], input[name='recipientNameUpdate']").keypress(function(e) {
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
		}
		else {
			$("#btn_submit").prop('disabled', true);
		}
	});

	//Recipient Name Update on keyup 
	$("input[name='recipientNameUpdate']").keyup(function(){
		var recipientName = $(this).val();
		if(recipientName != "" && items.length > 0) {
			$("#btn_update").prop('disabled', false);
		}
		else {
			$("#btn_update").prop('disabled', true);
		}
	});

	//Cancel
	$("#btn_cancel_paid").click(function(){
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

	$("#unpaidNav").click(function() {
		createType = "unpaid";
		_formReset();
	});

	$("#paidNav").click(function() {
		createType = "paid";
		_formReset();
		KTFetchORNO();
	});	

	//Cbo Status
	$("#cboStatus").change(function(){
		var val = $(this).val();
		table.column(4).search($(this).val(), false, false).draw();	
	});

	//Click Priview in Receipt
	$("#btn_preview").click(function(){
		if ( createType == "unpaid" ) {
			_generatePDF(true, $("input[name='recipientName']").val());
		} else {
			$("input[name='recipientNamePaid']").val();
			_generatePDF(true, $("input[name='recipientNamePaid']").val(), $("#spanORNum").text());
		}
		$("#divPreview").show(0);
	})

	//Close Priview in Receipt
	$("#btn_close").click(function(){
		$("#divPreview").hide(0);
	})

	//Add Item
	var _addItem = function() {
		var subAcct;
		var enc;
		if(option == "create") {
			subAcct = (createType == "unpaid") ? $("select[name='subAccts']") : $("select[name='subAcctsPaid']");
			enc = 1;
		} else {
			subAcct = $("select[name='subAcctsUpdate']");
			enc = 0;
		}

		if(subAcct.val() != "") {
			$.ajax({
				url:  add_item_url,
				type: "post",
				data: { 
					id: subAcct.val(),
					enc : enc
				},
				beforeSend: function() {
					//_beforeSend();				
					KTApp.block('#divSummary', {
					  	overlayColor: '#000000',
					  	state: 'danger',
					  	message: 'Please wait...'
					});
				},
				complete: function() {
					//_complete();
					KTApp.unblock('#divSummary');
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
				},
				error:function(a,b,c) {
                    forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
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
			$("#divNoItems").show(0);
			$("#divButtons").hide(0);
			$("#divHasItems").hide(0);
			$("#form-orderofpayment")[0].reset();
		 	$("#form-orderofpayment-paid")[0].reset();
			$("select[name='subAccts']").val('').selectpicker('refresh');
			$("select[name='subAcctsPaid']").val('').selectpicker('refresh');
		} else {
			$("#form-orderofpayment-update")[0].reset();
			$("select[name='subAcctsUpdate']").val('').selectpicker('refresh');
		}
		items = new Array();
		_appendItem();
	}

	//Toggle Action For Action Button - List / Create
	var _toggleAction = function(menu) {
		$(".dropdown-item").removeClass('active');
		$(menu).addClass("active");
		if(menu == "#orderPaymentListMenu") {
			$("#orderPaymentCreateContent").hide(0);
			$("#orderPaymentListContent").show(0);
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
    var _handleCreateUnpaidForm = function() {
        var validation;

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

        //Save
        $("#btn_submit").on('click', function(e) {
            e.preventDefault();
            validation.validate().then(function(status) {
                if (status == 'Valid' && items.length > 0) 
                {
                	Swal.fire({
                        title: "Are you sure?",
                        html: "<b>You want to create <span class='text-danger'> UNPAID </span> order payment?!</b>",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Create",
                        cancelButtonText: "Cancel",
                        customClass: {
                           confirmButton: "btn btn-success mt-0"
                        },
                        reverseButtons: true
                    }).then(function(result) {
                        if (result.value) {
                        	var fd = new FormData($("#form-orderofpayment")[0]);
		                    fd.append('transType', 1);
		                    fd.append('items', JSON.stringify(items));
		                    fd.append('paid', 0);
		                    fd.append('enc', _enc);
		                    $.ajax({
		                        url : create_trans_url,
		                        data: fd,
		                        processData: false,
		                        contentType: false,
		                        type: "POST",
		                        beforeSend: function() {
		                            _beforeSend();
		                        },
		                        complete: function(xhr) {
		                            _complete();
		                        },
		                        success:function(res)
		                        {
		                            if ( typeof res != 'string' ) {
		                            	Swal.fire({
					                        title: "Success!",
					                        html: "Unpaid order payment has been successfully created <br>Transaction Code: <b>"+ res[0] +"</b>",
					                        icon: "success",
					                        confirmButton: "btn btn-success"
					                    })
		                            	_formReset();
		                            	//$("#orderPaymentListMenu").click();
		                            }
		                            else {
		                            	res = res.trim();
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
            });
        })

        //Cancel
		$("#btn_cancel").click(function(){
			_enc = 1;
			validation.resetForm();
			$("#btn_add").prop('disabled', false);
			_formReset();
		});
    };

    //Setting up validation in Form
    var _handleCreatePaidForm = function() {
        var validation;    

        validation = FormValidation.formValidation(
            KTUtil.getById('form-orderofpayment'),
            {
                fields: {
                    recipientNamePaid: {
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
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }
            }
        );

        //Save
        $("#btn_submit_paid").on('click', function(e) {
            e.preventDefault();

            validation.validate().then(function(status) {
                if (status == 'Valid' && items.length > 0) 
                {
                	Swal.fire({
	                        title: "Are you sure?",
	                        html: "<b>You want to create <span class='text-success'> PAID </span> order payment?!</b>",
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
                        	var fd = new FormData($("#form-orderofpayment-paid")[0]);
		                    fd.append('transType', 1);
		                    fd.append('items', JSON.stringify(items));
		                    fd.append('orNo', $("#spanORNum").text());
		                    fd.append('paid', 1);
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
							            _printReceipt($("#spanORNum").text());
		                        		if(res[1][0] == "success") {
							        		$("#spanORNum").text(res[1][1]);
							            } else {
							            	$("#noLeftMsg").prop('hidden', false);
							            }
							            _formReset();
		                            } else {
		                            	res = res.trim(); 
			                            if ( res == "or_no_exists") {
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

			                            else if (res == "not_authorized") {
			                            	Swal.fire({
			                            		title: "Failed",
			                            		icon: "error",
											  	text: 'You are not authorized to create paid transaction.'
											}).then(function(result) {
										        if (result.value) {
										            location.reload();
										        }
										    });
			                            }

			                            else if (res == "maintenance") {
			                            	Swal.fire({
			                            		title: "Failed",
			                            		icon: "error",
											  	text: 'Paid Order payment is under maintenance.'
											});
			                            }

			                            else {
			                                forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
			                            }
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
		                    fd.append('transType', 4);
		                    fd.append('items', JSON.stringify(items));
		                    fd.append('id', opid);
		                    fd.append('enc', 0);
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
		                        	res = res.trim();
		                        	if( res == 'processed' ) {
		                        		Swal.fire({
		                        			title: "Failed!",
									        text: "This order payment is already processed.",
									        icon: "error",
									        buttonsStyling: false,
									        confirmButtonText: "Ok",
									        customClass: {
									            confirmButton: "btn font-weight-bold btn-danger"
									        }
									    }).then(function(result) {
									        if (result) {
                        						table.ajax.reload();
                        						items = new Array();
									            _formReset();
									            _appendItem();
									            $("#editDetailsModal").modal('hide');
									        }
									    })
		                        	}
		                        	else if(res == 'success') {
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

		//Cancel Update
		$("#btn_cancel_update").click(function(){
			validation.resetForm();
			$("#btn_add_update").prop('disabled', false);
			_formReset();
		});
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
                	panel : 'orderpayment',
					columnsDef: [
						//'DT_RowIndex', 
						'TransCode', 
						'RecipientName',
						'CreatedAt', 
						'CreatedBy',
						'Status', 
						'TotalAmount',
						'Action'
					],
				},
            },
            columns: [
            	//{data: 'DT_RowIndex'},
				{data: 'TransCode'},
				{data: 'RecipientName'},
				{data: 'CreatedAt'},
				{data: 'CreatedBy'},
				{data: 'Status'},
				{data: 'TotalAmount'},
				{data: "Action", orderable: false, searchable: false},
			],
            columnDefs: [
                {   
                    targets: 4,
                    render: function( data, type, row ) {
                        var status = {
							0: {'title': 'Unprocess', 'class': 'label-light-danger'},
							1: {'title': 'Processed', 'class': ' label-light-primary'},
						};
					
						return '<span class="label ' + status[row.Status].class + ' label-inline font-weight-bold label-lg">' + status[row.Status].title + '</span>';
                    }
                },
                {   
                    targets: 5,
                    title: "Total Amount",
                    render: function( data, type, row ) {
						return "<div class='text-right'>₱ " + _addComma(parseFloat(row.TotalAmount).toFixed(2)) + "</div>";
                    }
                },
                {
                	targets: 6,
                    title: "Action",
                    render: function( data, type, row ) {
                    	var id = data;
                    	if (row.Status == 0)
                    	{
							return `
		                        <div class="dropdown dropdown-inline ml-1">
		                            <a href="javascript:;" class="btn btn-sm btn-clean btn-icon" data-toggle="dropdown" title="View details">
		                                <i class="la la-cog"></i>
		                            </a>
		                            <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">
		                                <ul class="nav nav-hoverable flex-column">
		                                    <li class="nav-item"><a class="nav-link" href="javascript:;" onclick=KTViewDetails("`+id+`",0)><i class="nav-icon la la-comment"></i><span class="nav-text">View Details</span></a></li>
		                                    <li class="nav-item"><a class="nav-link" href="javascript:;" onclick=KTEditDetails("`+id+`")><i class="nav-icon la la-edit"></i><span class="nav-text">Edit Details</span></a></li>
		                                </ul>
		                            </div>
		                        </div>
		                    `;
                    	}
                    	else
                    	{
		                    return `
		                    	<a class="nav-link" href="javascript:;" onclick=KTViewDetails("`+id+`",1)>
		                    		<i class="nav-icon la la-comment"></i>
		                    	</a>
		                    `;
                    	}
                    }
                }
                
            ]
        });
    };

	return {
		// public functions
		init: function () {
			_getUrlParameter("action");
			$("#divPreview").hide(0);
			$("#divHasItems").hide(0);
			$("#divButtons").hide(0);
			$("#divHasItemsUpdate").hide(0);
			_handleCreateUnpaidForm();
			_handleCreatePaidForm();
			_handleUpdateForm();

			if ( table ) { table.column(5).search($("#cboStatus").val(), false, false).draw(); }
			$("#cboStatus").selectpicker();
			$("select[name='subAccts']").selectpicker();
			$("select[name='subAcctsUpdate']").selectpicker();
			$("#btn_update").prop('disabled', true);
		}
	};

}();

jQuery(document).ready(function () {
	KTOrderOfPayment.init();
});
