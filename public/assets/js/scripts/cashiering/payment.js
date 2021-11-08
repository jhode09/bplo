"use strict";

var table1,
    table2,
    table3,
    pid,
    opid,
    opPayor,
    opTrxCode,
    opTotal;

menuActive('li-menu-cashiering', 'li-submenu-cashiering-payment');

//Void Payment
var KTVoidPayment = function(id) {
    $("#voidPaymentModal").modal('show');
    pid = id;
}

//View Details
var KTViewDetails = function(id, status) {
	$.ajax({
        url : fetch_paymentdetails_url,
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
                $("#paymentDetails").empty();
                var output = "";
                /*var total = res[0].TotalAmount;
                output += "<div class='row'>";
                for (var i = 0; i < res.length; i++) {
                    output  += "<div class='col-lg-6'><span class='label label-dot label-dark mr-2'></span>"    + res[i].SubAcctTitle + "</div>";
                    output  += "<div class='col-lg-6 mb-2'> ₱ " + res[i].Amount + " x " + parseInt(res[i].Qty) + "</div>";
                }*/
                var total = _addComma(parseFloat(res[0].TotalAmount).toFixed(2));
                output += "<div class='row'>";
                for (var i = 0; i < res.length; i++) {
                    output  += "<div class='col-lg-6'><span class='label label-dot label-dark mr-2'></span>"    + res[i].SubAcctTitle + "</div>";
                    output  += "<div class='col-lg-6 mb-2'> ₱ " + _addComma(parseFloat(res[i].Amount).toFixed(2)) + " x " + parseInt(res[i].Qty) + "</div>";
                }
                output += "</div>";
                output += "<div class='col-lg-12 separator separator-solid mb-2'></div>";
                $("#ptotal_amount").text(total);
                $("#paymentDetails").append(output);
                $("#paymentDetailsModal").modal('show');
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

//View ORDER Details
var KTViewORDetails = function(id, status, markAsPaid = false) {
    $.ajax({
        url : fetch_orderpaymentdetails_url,
        type: "POST",
        data: { "id": id },
        beforeSend: function(){
            _beforeSend();
        },
        complete: function() {
            _complete();
        },
        success:function(res) {
            if(res != "not_found") {
                if(!markAsPaid) { 
                    $("#btn_close_pay").text("Close");
                    $("#btn_proceed_pay").prop('hidden', true); 
                } else { 
                    $("#btn_close_pay").text("Cancel");
                    $("#btn_proceed_pay").prop('hidden', false); 
                }
                $("#orderPaymentDetails").empty();
                var output = "";
                var total = _addComma(parseFloat(res[0].TotalAmount).toFixed(2));
                output += "<div class='row'>";
                for (var i = 0; i < res.length; i++) {
                    output  += "<div class='col-lg-6'><span class='label label-dot label-dark mr-2'></span>"    + res[i].SubAcctTitle + "</div>";
                    output  += "<div class='col-lg-6 mb-2'> ₱ " + _addComma(parseFloat(res[i].Amount).toFixed(2)) + " x " + parseInt(res[i].Qty) + "</div>";
                }
                output += "</div>";
                output += "<div class='col-lg-12 separator separator-primary separator-dashed mb-2'></div>";
                $("#optotal_amount").text(total);
                $("#orderPaymentDetails").append(output);
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

//View Payment Type - Check || EPP
var KTPaymentType = function(id,type) {
    $.ajax({
        url : fetch_paymenttype_url,
        type: "POST",
        data: {
            "id": id,
            "type":type
        },
        success:function(res) {
            if(type == 2) {
                $("#dBankName").text(res.bankname);
                $("#dAgency").text(res.agency);
                $("#dCheckNumber").text(res.check_number);
                $("#dCheckDate").text(res.date);
                $("#paymentTypeEPP").prop('hidden', true);
                $("#paymentTypeCheck").prop('hidden', false);
            } else {
                $("#dEppNum").text(res.ref_number);
                $("#paymentTypeCheck").prop('hidden', true);
                $("#paymentTypeEPP").prop('hidden', false);
            }
            $("#paymentTypeModal").modal('show');
        }, 
        error:function(a,b,c) {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    });
}

var KTViewBPLOPaymentDetails = function() {
    $("#modalBploPaymentDetails").modal('show');
}

//Mark as Paid
var KTMarkAsPaid = function(id, payor, trxCode, total) {
    opid      = id;
    opPayor   = payor;
    opTrxCode = trxCode;
    opTotal   = total;
    KTViewORDetails( id, 0, true );
}

//Reprint Receipt
var KTReprintReceipt = function( opID, orNo ) {
    _printReceipt(opID, orNo);
    _printCedula(opID, orNo);
}

var KTReprintCedula = function( opID, orNo ) {
    _printCedula(opID, orNo);
}

//Receipt
var _printReceipt = function( id, orNo ) {
    $.ajax({
        url : fetch_orderpaymentdetails_url,
        type: "post",
        data: { "id": id },
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
                    or.text(20, 50, dateToday);

                    or.setFontSize(12);
                    or.setFont('courier')
                    or.setFontType('normal')
                    or.text(20, 65, res[0].RecipientName.toUpperCase());

                    var y = 75;
                    var titleSize = 11;

                    $.each( res, function(index, item ){
                        or.setFontSize(titleSize);
                        or.setFont('courier')
                        or.setFontType('normal')
                        or.text(20, y, item.SubAcctTitle + "(" + parseInt(item.Qty) + ")");

                        or.setFontSize(11);
                        or.setFont('courier')
                        or.setFontType('normal')
                        or.text(160, y, _addComma(parseFloat(item.Amount)).toString());
                        y += 5;
                    });

                    or.setFontSize(12);
                    or.setFont('courier')
                    or.setFontType('normal')
                    or.text(160, 135, _addComma(parseFloat(res[0].TotalAmount)).toString());

                    or.setFontSize(9);
                    or.setFont('courier')
                    or.setFontType('normal')
                    or.text(20, 135, "O.R. #"+ orNo);

                    or.setFontSize(12);
                    or.setFont('courier')
                    or.setFontType('normal')
                    or.text(20, 140, _numberToWords(parseInt(res[0].TotalAmount).toString()).toUpperCase() + " PESOS");

                    or.setFontSize(15);
                    or.setFont('courier')
                    or.setFontType('normal')
                    or.text(160, 170, agent.toUpperCase());
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

  //Cedula
var _printCedula = function( id, orNo ) {
    $.ajax({
        url : fetch_orderpaymentdetails_url,
        type: "post",
        data: { "id": id },
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
            if(res == "not_found") {
                forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
            } else {
                console.log(res)
                    /******RECEIPT********/
                var or = new jsPDF();
                var year =  moment().format("YYYY");
                var currentyear = year.substring(2, 4);

                or.setProperties({
                    title: "Community Tax Certificate",
                    author: "Cabuyao Government",
                    keywords: "generated, javascript, web 2.0, ajax",
                });

                // ===========================

                or.setFontSize(10);
                or.setFont('courier')
                or.setFontType('bold')
                or.text(9, 20, "" + currentyear + "");

                or.setFontSize(10);
                or.setFont('courier')
                or.setFontType('bold')
                or.text(15, 20, "BRGY MAMATID, CABUYAO");

                or.setFontSize(10);
                or.setFont('courier')
                or.setFontType('bold')
                or.text(70, 20, "" + moment().format('YYYY-MM-DD') + "");

                // ===========================
                or.setFontSize(10);
                or.setFont('courier')
                or.setFontType('bold')
                or.text(5, 25, "LAST NAME");

                or.setFontSize(10);
                or.setFont('courier')
                or.setFontType('bold')
                or.text(35, 25, "FIRST NAME");

                or.setFontSize(10);
                or.setFont('courier')
                or.setFontType('bold')
                or.text(70, 25, "MIDDLE NAME");

                // ===========================
                or.setFontSize(9);
                or.setFont('courier')
                or.setFontType('bold')
                or.text(5, 30, "B169 L57 PH 1 MABUHAY CITY BRGY. MAMATID, CABUYAO");

                or.setFontSize(10);
                or.setFont('courier')
                or.setFontType('bold')
                or.text(100 , 26, "000 000 000 00000");

                // ===========================
                or.setFontSize(10);
                or.setFont('courier')
                or.setFontType('bold')
                or.text(5, 35, "FILIPINO");

                or.setFontSize(10);
                or.setFont('courier')
                or.setFontType('bold')
                or.text(70, 35, "TAYUG, PANGASINAN");

                // ===========================

                or.setFontSize(10);
                or.setFont('courier')
                or.setFontType('bold')
                or.text(100 , 40, "Jul 28 1997");

                // ===========================

                or.setFontSize(10);
                or.setFont('courier')
                or.setFontType('bold')
                or.text(125 , 53, "5.00");

                or.setFontSize(10);
                or.setFont('courier')
                or.setFontType('bold')
                or.text(125 , 80, "5.00");

                or.setFontSize(10);
                or.setFont('courier')
                or.setFontType('bold')
                or.text(125 , 90, "5.00");

                var splitTitle = or.splitTextToSize("TEN THOUSAND FIVE HUNDRED NIGHTY FOUR PESOS ONLY", 60);

                or.setFontSize(9);
                or.setFont('courier')
                or.setFontType('bold')
                or.text(100 , 95, splitTitle );

                var y = 75;
                var titleSize = 11;

                or.setFontSize(15);
                or.setFont('courier')
                or.setFontType('normal')
                or.text(160, 170, "");
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

//Convert Total Amount to Words
var _numberToWords = function(number) {  
    var digit          = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];  
    var elevenSeries   = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];  
    var countingByTens = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];  
    var shortScale     = ['', 'thousand', 'million', 'billion', 'trillion'];  
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

//Edit Details - Pending
/*var KTEditDetails = function(id) {
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
}*/

var _addComma = function(val) {
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
}

// Class definition
var KTPayment = function () {

	//Set Up Ajax CSRF
	$.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    //Proceed in payment
    $("#btn_proceed_pay").click(function() {
        $.ajax({
            url: fetch_orno_url,
            processData: false,
            contentType: false,
            type: "post",
            beforeSend: function() {
                _beforeSend();
            },
            complete: function() {
                _complete();
            },
            success:function(res) {
                var balance = 0,
                    count   = 0,
                    begin   = 0,
                    diff    = 0, // Difference of Count & Balance
                    orNo    = "",
                    msg     = "";
                if( res.length > 0 ) 
                {
                    balance = res[0].Balance; 
                    count   = res[0].Count;
                    begin   = res[0].Beginning;
                    diff    = count - balance;
                    if( diff == 0) {
                        orNo = begin;
                    } else {
                        orNo = begin + diff;
                    }
                    msg += "<b>Mark this as Paid?!</b> <br><br>\
                            <div class='form-group row p-0 m-0'>\
                                <label class='col-5 text-right'>Trx Code : </label>\
                                <div class='col-7 text-left'>\
                                    <span class='font-weight-bolder'>"+ opTrxCode +"</span>\
                                </div>\
                            </div>\
                            <div class='form-group row p-0 m-0'>\
                                <label class='col-5 text-right'>Payor : </label>\
                                <div class='col-7 text-left'>\
                                    <span class='font-weight-bolder'>"+ opPayor +"</span>\
                                </div>\
                            </div>\
                            <div class='form-group row p-0 m-0'>\
                                <label class='col-5 text-right'>Total Amount : </label>\
                                <div class='col-7 text-left'>\
                                    <span class='font-weight-bolder'>₱ "+ opTotal +"</span>\
                                </div>\
                            </div>\
                            <div class='form-group row p-0 m-0'>\
                                <label class='col-5 text-right'>O.R. Number : </label>\
                                <div class='col-7 text-left'>\
                                    <span class='font-weight-bolder'>"+ orNo +"</span>\
                                </div>\
                            </div>";

                    Swal.fire({
                        title: "Confirmation",
                        html:  msg,
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "Yes, please!",
                        cancelButtonText: "No, cancel!",
                        customClass: {
                           confirmButton: "btn btn-success mt-0"
                        },
                        reverseButtons: true
                    }).then(function(result) {
                        if(result.isConfirmed) {
                            $.ajax({
                                url : create_trans_url,
                                data: {
                                    "transType" : 2,
                                    "orNo" : orNo, 
                                    "id"   : opid
                                },
                                type: "POST",
                                success:function(res)
                                {
                                    if(typeof res != 'string') {
                                        table1.ajax.reload();
                                        table2.ajax.reload();
                                        _printReceipt(opid, orNo);
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
                        } else {
                            KTViewORDetails( opid, 0, true );
                        }
                    });
                } else 
                {
                    //No OR
                    forSwal("No remaining O.R. Series.", "error", "btn-danger");
                }
            },
            error: function(a,b,c) {
                forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
            }
        });
    })
    
    //Payment Type - BPLO or Treasury
    $("#cboModuleType").change(function(){
        if($(this).val() == 2) {
            $("#divTreasury").hide(0);
            $("#divBplo").show(0);
        } else {
            $("#divBplo").hide(0);
            $("#divTreasury").show(0);
        }
    })

	//Cbo Status
	$("#cboStatus").change(function(){
		var val = $(this).val();
		table2.column(6).search($(this).val(), false, false).draw();	
	})

    //Click Unprocessed
    $("#orderpaymentNav").click(function() {
        _typeAheadSearch();
        window.history.replaceState(null, null, "?action=orderpayment");
    })

    //Click Unprocessed
    $("#unprocessNav").click(function() {
        window.history.replaceState(null, null, "?action=unprocess");
        _loadTable1();
    })

    //Click Processed
    $("#processedNav").click(function() {
        window.history.replaceState(null, null, "?action=processed");
        _loadTable2();
    })

    //Click Search
    $("#btnSearch").click(function(){
        var keyword = $("#searchKeyword").val();
        if( keyword != "" )
        {
            var btn = KTUtil.getById("btnSearch");
            $.ajax({
                url : fetch_op_data_url,
                type: "post",
                data: {
                    keyword : keyword
                },
                beforeSend: function() {
                    $("#iconSearch").hide(0);
                    KTUtil.btnWait(btn, "spinner spinner-right spinner-white pr-15");
                },
                complete: function() {
                    $("#iconSearch").show(0);
                    KTUtil.btnRelease(btn);
                },
                success: function(res) {
                    var table = $("#tblSubAcct tbody");
                    var rd = "";
                    if ( typeof res != "string" ) {
                        opid = res.orderPaymentID;
                        $("#spanSearchBy").text(res.searchBy);
                        $("#payment").prop('readonly', false);

                        if (res.searchType == 1) {
                            $("#labelTrxOrName").text('Receipient name');
                            $("#trxOrName").val(res.orderPayment.recipient_name);
                        } else {
                            $("#labelTrxOrName").text('Trx Code');
                            $("#trxOrName").val(res.trxCode);
                        }

                        var balance = 0,
                        count   = 0,
                        begin   = 0,
                        diff    = 0, // Difference of Count & Balance
                        orNo    = "",

                        balance = res.orNo[0].Balance; 
                        count   = res.orNo[0].Count;
                        begin   = res.orNo[0].Beginning;
                        diff    = count - balance;
                        if( diff == 0) {
                            orNo = begin;
                        } else {
                            orNo = begin + diff;
                        }

                        $("#orNo").val(orNo);

                        var total = 0;
                        $.each(res.orderPaymentDetails, function(index, value){
                            var code   = (value.subacct_code) ? value.subacct_code : "--";
                            total += (value.qty * value.amount);
                            rd += "<tr>";
                            rd += "<td class='pt-1 pb-1'>" + code + "</td>";
                            rd += "<td class='pt-1 pb-1 font-size-sm'>" + value.subacct_title + "</td>";
                            rd += "<td class='pt-1 pb-1'>" + parseInt(value.qty) + "</td>";
                            rd += "<td class='text-right pt-1 pb-1'> ₱ " + _addComma(parseFloat(value.amount).toFixed(2)) + "</td>";
                            rd += "</tr>";
                        });

                        rd += "<tr>";
                        rd += "<td class='pt-1 pb-1'>&nbsp;</td>";
                        rd += "<td class='pt-1 pb-1'>&nbsp;</td>";
                        rd += "<td class='pt-1 pb-1 font-weight-bolder'>Total</td>";
                        rd += "<td class='text-right pt-1 pb-1'> ₱ " + _addComma(parseFloat(total).toFixed(2)) + "</td>";
                        rd += "</tr>";


                        $("#amount").val(res.orderPayment.total);
                        $("#payment").val(0).focus();
                        $("#paymentChange").val(0);
                        $("#btnSaveAndPrint").attr('disabled', true);
                    } else {
                        forSwal("No order payment found.", "error", "btn-danger");
                        rd += "<tr><td class='text-center' colspan='4'>No data available</td></tr>";
                        _resetOrderPayment();
                    }
                    table.empty();
                    table.append(rd);
                }, error: function(a,b,c) {
                    forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                }
            });
        }
        else
        {
            $("#searchKeyword").focus();
        }
    })

    //Change Payment Type
    $("select[name='paymentType']").change(function(){
        var type = $(this).val();
        if (type == 2) {
            $("#checkPaymentModal").modal('show');
        } else if ( type == 3 ) {
            $("#eppPaymentModal").modal('show');
        } else {
            $(".bank, .epp").hide(0);
            $("#spanPaymentType").text("Cash");
        }
    })

    //Close Modal
    $("#btnCloseEPP, #btnCloseCheck").click(function() {
        $("select[name='paymentType']").val(1);
        $("#spanPaymentType").text("Cash");
        $(".bank, .epp").hide(0);
    })

    //Input Mask
    // $("#payment").inputmask('decimal', {
    //     repeat: 10,
    //     rightAlignNumerics: false
    // });

    //Compute Change on Keyup
    $("#payment").on('keyup blur keypress', function() {
        var txtAmount  = $("#amount").val().replace('₱ ', '').replaceAll(',', '');
        var txtPayment = $(this).val().replace('₱ ', '').replaceAll(',', '');
        var amount  = parseFloat(txtAmount);
        var payment = parseFloat(txtPayment);
        var change  = 0;
        if (payment >= amount) {
            change = ( payment - amount );
            $("#btnSaveAndPrint").attr('disabled', false);
        } else {
            change = 0;
            $("#btnSaveAndPrint").attr('disabled', true);
        }
        $("#paymentChange").val(change.toFixed(2));
    })

    //Click Btn Save and Print
    $("#btnSaveAndPrint").click(function() {
        var btn = KTUtil.getById("btnSaveAndPrint");
        var txtAmount  = $("#amount").val().replace('₱ ', '').replaceAll(',', '');
        var txtPayment = $("#payment").val().replace('₱ ', '').replaceAll(',', '');
        var amount  = parseFloat(txtAmount);
        var payment = parseFloat(txtPayment);
        if (payment >= amount) {
            $.ajax({
                url: fetch_orno_url,
                processData: false,
                contentType: false,
                type: "post",
                beforeSend: function() {
                    KTUtil.btnWait(btn, "spinner spinner-right spinner-white pr-15");
                },
                complete: function() {
                    KTUtil.btnRelease(btn);
                },
                success:function(res) {
                    var balance = 0,
                        count   = 0,
                        begin   = 0,
                        diff    = 0, // Difference of Count & Balance
                        orNo    = "",
                        msg     = "";
                    if( res.length > 0 ) 
                    {
                        balance = res[0].Balance; 
                        count   = res[0].Count;
                        begin   = res[0].Beginning;
                        diff    = count - balance;
                        if( diff == 0) {
                            orNo = begin;
                        } else {
                            orNo = begin + diff;
                        }
                        msg += "<b>Payment Details</b> <br><br>\
                                <div class='form-group row p-0 m-0'>\
                                    <label class='col-5 text-right'><span class='font-size-sm'>"+$("#spanSearchBy").text()+"</span></label>\
                                    <div class='col-7 text-left'>\
                                        <span class='font-weight-bolder'>"+$("#searchKeyword").val()+"</span>\
                                    </div>\
                                </div>\
                                <div class='form-group row p-0 m-0'>\
                                    <label class='col-5 text-right'>Total Amount</label>\
                                    <div class='col-7 text-left'>\
                                        <span class='font-weight-bolder'>"+$("#amount").val()+"</span>\
                                    </div>\
                                </div>\
                                <div class='form-group row p-0 m-0'>\
                                    <label class='col-5 text-right'>O.R. Number</label>\
                                    <div class='col-7 text-left'>\
                                        <span class='font-weight-bolder'>"+ orNo +"</span>\
                                    </div>\
                                </div>";

                        Swal.fire({
                            title: "Confirmation",
                            html:  msg,
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonText: "Yes, please!",
                            cancelButtonText: "No, cancel!",
                            customClass: {
                               confirmButton: "btn btn-success mt-0"
                            },
                            reverseButtons: true
                        }).then(function(result) {
                            if(result.isConfirmed) {
                                $.ajax({
                                    url : create_trans_url,
                                    data: {
                                        "transType"   : 2,
                                        "orNo"        : orNo, 
                                        "id"          : opid,
                                        "bankName"    : $("#checkBankName").val(),
                                        "agency"      : $("#checkAgency").val(),
                                        "checkNumber" : $("#checkNumber").val(),
                                        "checkDate"   : $("#checkDate").val(),
                                        "eppNumber"   : $("#eppNumber").val(),
                                        "paymentType" : $("#paymentType").val(),
                                        "payment"     : $("#payment").val()
                                    },
                                    type: "POST",
                                    success:function(res)
                                    {
                                        if(typeof res != 'string') {
                                            _typeAheadSearch();
                                            _printReceipt(opid, orNo);
                                            _resetOrderPayment();
                                            _countOR();
                                            $("#searchKeyword").val("");
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
                    } else 
                    {
                        //No OR
                        forSwal("No remaining O.R. Series.", "error", "btn-danger");
                    }
                },
                error: function(a,b,c) {
                    forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                }
            });
        } else {
            forSwal("Invalid Request.", "error", "btn-danger");
        }
    })
    
    //Cancel Payment
    $("#btnCancel").click(function(){
        _resetOrderPayment();
        $("#searchKeyword").val("");
    })

    var _resetOrderPayment = function() {
        var zero = 0;
        $("#amount").val(zero.toFixed(2));
        $("#payment").val(zero.toFixed(2)).prop('readonly', true);
        $("#paymentChange").val(zero.toFixed(2));
        $("#orNo").val("");
        $("#trxOrName").val("");
        $("#labelTrxOrName").text("Trx Code / Receipient name");
        $("#spanPaymentType").text('Cash');
        $("#paymentType").val(1);
        $(".epp").hide(0);
        $(".bank").hide(0);
        $("#spanSearchBy").text("Enter Keyword");
        $("#tblSubAcct tbody").empty();
        $("#tblSubAcct tbody").append("<tr><td class='text-center' colspan='4'>No data available</td></tr>");
        opid = "";
    }

    //Load DataTable Unprocess Payment
    var _loadTable1 = function() {

        if( table1 ) { 
            table1.clear();
            table1.destroy(); 
        }

        table1 = $('#tbl_orderpayment').DataTable({
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
                    panel : 'payment',
                    columnsDef: [
                        'DT_RowIndex', 
                        'TransCode', 
                        'RecipientName',
                        'CreatedAt', 
                        'CreatedBy',
                        'Status', 
                        null, 
                        'Action'
                    ],
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
                        return '<span class="label label-light-danger label-inline font-weight-bold label-lg"> Unpaid </span>';
                    }
                },
                {   
                    targets: 6,
                    title: "Total Amount",
                    render: function( data, type, row ) {
                        return "<div class='text-right'> ₱ " + _addComma(parseFloat(row.TotalAmount).toFixed(2)) + "</div>";
                    }
                },
                
            ]
        });
    };

    //Load DataTable Processed Payment
    var _loadTable2 = function() {

    	if( table2 ) { 
    		table2.clear();
    		table2.destroy(); 
    	}

        table2 = $('#tbl_payment').DataTable({
        	responsive: true,
            processing: true,
            //serverSide: true,
            language: {                
	            infoFiltered: ""
	        },
            ajax: {
                method : "POST",
                url    : fetch_paymentlist_url,
                data: {
					columnsDef: [ 
                        'TransCode',
                        'ORNO', 
                        'RecipientName',
						'TrxDate', 
                        'CreatedBy',
						'Status',
                        'Type',
                        'TotalAmount',
                        "Action"],
				},
            },
            columns: [
				{data: 'TransCode'},
                {data: 'ORNO'},
				{data: 'RecipientName'},
				{data: 'TrxDate'},
				{data: 'CreatedBy'},
				{data: 'Status'},
				{data: 'Type'},
                {data: 'TotalAmount'},
				{data: 'Action', orderable:false, searchable:false},
			],
            columnDefs: [
                {   
                    targets: 5,
                    title: "Status",
                    render: function( data, type, row ) {

                        var status = {
							0: {'title': 'Paid', 'class': 'label-light-primary'},
							1: {'title': 'Void', 'class': 'label-light-danger'},
						};
					
						return '<span class="label ' + status[row.Status].class + ' label-inline font-weight-bold label-lg">' + status[row.Status].title + '</span>';
                    }
                },
                {   
                    targets: 6,
                    title: "Type",
                    render: function( data, type, row ) {
                        var id = row.PaymentID;
                        var type = {
                            1: {'title': 'Cash', 'class': 'label-light-success'},
                            2: {'title': 'Check', 'class': 'label-light-info'},
                            3: {'title': 'EPP', 'class': 'label-light-primary'},
                        };
                        if (row.Type != 1) {
                            return '<a type="button" onclick=KTPaymentType('+id+','+row.Type+')>\
                                        <span class="label ' + type[row.Type].class + ' label-inline font-weight-bold label-lg">' + type[row.Type].title + '</span>\
                                    </a>';
                        } else {
                            return '<span class="label ' + type[row.Type].class + ' label-inline font-weight-bold label-lg">' + type[row.Type].title + '</span>'
                        }
                    }
                },
                {   
                    targets: 7,
                    title: "Total Amount",
                    render: function( data, type, row ) {
                        return "<div class='text-right'> ₱ " + _addComma(parseFloat(row.TotalAmount).toFixed(2)) + "</div>";
                    }
                },
                
            ]
        });
    };

    //Load DataTable BPLO Payment
    var _loadTable3 = function() {

        if( table3 ) { 
            table3.clear();
            table3.destroy(); 
        }

        table3 = $('#tbl_bplo').DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            language: {                
                infoFiltered: ""
            },
            ajax: {
                method : "POST",
                url    : fetch_orderpaymentlistbplo_url,
                data: {
                    columnsDef: [
                        'DT_RowIndex', 
                        'TOP', 
                        'RecipientName',
                        'CreatedAt', 
                        'CreatedBy',
                        'Status', 
                        null, 
                        'Action'
                    ],
                },
            },
            columns: [
                {data: 'DT_RowIndex'},
                {data: 'TOP'},
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
                        return '<span class="label label-light-danger label-inline font-weight-bold label-lg"> Unpaid </span>';
                    }
                },
                {   
                    targets: 6,
                    title: "Total Amount",
                    render: function( data, type, row ) {
                        return "<div class='text-right'> ₱ " + _addComma(parseFloat(row.TotalAmount).toFixed(2)) + "</div>";
                    }
                },
                
            ]
        });
    };

    var _handleVoidPayment = function () {
        var validation;

        validation = FormValidation.formValidation(
            KTUtil.getById('form-void-payment'),
            {
                fields: {
                    reasons: {
                        validators: {
                            notEmpty: {
                                message: 'Reasons is required'
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
        
        $("#btn_proceed").on('click', function(e) {
            e.preventDefault();

            validation.validate().then(function(status) {
                if (status == 'Valid') 
                {
                    $("#loginModal").modal('show');
                }
                else 
                {
                    forSwal("Please enter a reasons.", "error", "btn-danger");
                }
            });
        });
    }

    var _handleLogin = function() {
        var validation;

        validation = FormValidation.formValidation(
            KTUtil.getById('form_login'),
            {
                fields: {
                    email: {
                        validators: {
                            notEmpty: {
                                message: 'Email is required'
                            },
                            stringLength: {
                                max:255,
                                message: 'Maximum of 255 characters only'
                            }
                        }
                    },
                    password: {
                        validators: {
                            notEmpty: {
                                message: 'Password is required'
                            },
                            stringLength: {
                                max:255,
                                message: 'Maximum of 255 characters only'
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
        
        $("#btn_submit").on('click', function(e) {
            e.preventDefault();

            validation.validate().then(function(status) {
                if (status == 'Valid') 
                {
                    var fd = new FormData($("#form_login")[0]);
                    fd.append('transType', 3);
                    fd.append('reasons', $("textarea[name='reasons']").val());
                    fd.append('id', pid);
                    $.ajax({
                        url : create_trans_url,
                        data: fd,
                        processData: false,
                        contentType: false,
                        type: "POST",
                        beforeSend:function() {
                            $("#btn_close, #btn_submit").prop('disabled', true);
                            $("#btn_submit").addClass('spinner spinner-white spinner-right');
                        },
                        complete: function(){
                            $("#btn_close, #btn_submit").prop('disabled', false);
                            $("#btn_submit").removeClass('spinner spinner-white spinner-right');
                        },
                        success:function(res)
                        {
                            res = res.trim();
                            if(res == 'success') {
                                forSwal("Successfully Voided", "success", "btn-success");
                                table2.ajax.reload();
                                $("#form-void-payment")[0].reset();
                                $("#form_login")[0].reset();
                                $("#voidPaymentModal").modal('hide');
                                $("#loginModal").modal('hide');
                            } else if (res == 'login_failed') {
                                $("#authFailedMsg").hide(0);
                                $("#loginFailedMsg").show(0);
                            } else if (res == 'not_authorized') {
                                $("#loginFailedMsg").hide(0);
                                $("#authFailedMsg").show(0);
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
                    $("#loginModal").modal('show');
                }
                else 
                {
                    forSwal("All fields are required.", "error", "btn-danger");
                }
            });
        });

        $("#closeLoginMsg").click(function(){
            $("#loginFailedMsg").hide(0);
        });

        $("#closeAuthMsg").click(function(){
            $("#authFailedMsg").hide(0);
        });
    }

    var _handleCheckPayment = function() {
        var validation;

        validation = FormValidation.formValidation(
            KTUtil.getById('form_check_payment'),
            {
                fields: {
                    checkBankName: {
                        validators: {
                            notEmpty: {
                                message: 'Bank Name is required'
                            },
                            stringLength: {
                                max:200,
                                message: 'Maximum of 200 characters only'
                            }
                        }
                    },
                    checkAgency: {
                        validators: {
                            notEmpty: {
                                message: 'Agency is required'
                            },
                            stringLength: {
                                max:200,
                                message: 'Maximum of 200 characters only'
                            }
                        }
                    },
                    checkNumber: {
                        validators: {
                            notEmpty: {
                                message: 'Check Number is required'
                            },
                            stringLength: {
                                max:50,
                                message: 'Maximum of 50 characters only'
                            }
                        }
                    },
                    checkDate: {
                        validators: {
                            notEmpty: {
                                message: 'Check Date is required'
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
        
        $("#btnSaveCheck").on('click', function(e) {
            e.preventDefault();

            validation.validate().then(function(status) {
                if (status == 'Valid') 
                {
                    $("#spanPaymentType").text("Check");
                    $("#spanCheckBankName").text($("input[name='checkBankName']").val());
                    $("#spanCheckAgency").text($("input[name='checkAgency']").val());
                    $("#spanCheckNumber").text($("input[name='checkNumber']").val());
                    $("#spanCheckDate").text($("input[name='checkDate']").val());
                    $(".epp").hide(0);
                    $(".bank").show(0);
                    $("#checkPaymentModal").modal('hide');
                }
            });
        });
    }

    var _handleEppPayment = function() {
        var validation;

        validation = FormValidation.formValidation(
            KTUtil.getById('form_epp_payment'),
            {
                fields: {
                    eppNumber: {
                        validators: {
                            notEmpty: {
                                message: 'EPP reference number is required.'
                            },
                            stringLength: {
                                max:50,
                                message: 'Maximum of 50 characters only'
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
        
        $("#btnSaveEpp").on('click', function(e) {
            e.preventDefault();

            validation.validate().then(function(status) {
                if (status == 'Valid') 
                {
                    $("#spanPaymentType").text("Electronic Payment Portal");
                    $("#spanEppNumber").text($("input[name='eppNumber']").val());
                    $(".bank").hide(0);
                    $(".epp").show(0);
                    $("#eppPaymentModal").modal('hide');
                }
            });
        });
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
        if(action == "processed") {
            $("#processedNav").click();
        } else if(action == "unprocess") {
            $("#unprocessNav").click();
        } else {
            $("#orderpaymentNav").click();
        }
    };

    var _countOR = function() {
        $.ajax({
            url : count_or_url,
            type: "post",
            success: function(res) { 
                res = res.trim();
                if (res == 0) {
                    $("#notifOR").hide(0);
                    $("#countOR").text('..');
                } else {
                    $("#notifOR").show(0);
                    $("#countOR").text(parseInt(res));
                }
            }
        });
    }

    var _typeAheadSearch = function() {
        $.ajax({
            url : init_typeahead_url,
            success: function(res) {

                var keywords = [];
                keywords = res;
                // constructs the suggestion engine
                var bloodhound = new Bloodhound({
                    datumTokenizer: Bloodhound.tokenizers.whitespace,
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    // `states` is an array of state names defined in \"The Basics\"
                    local: keywords
                });

                $("#searchKeyword").typeahead('destroy');
                $('#searchKeyword').typeahead({
                    hint: false,
                    highlight: true,
                    minLength: 1
                }, {
                    name: 'keywords',
                    source: bloodhound
                });
            }
        });
    }

  


	return {
		// public functions
		init: function () {
            _getUrlParameter("action");
            _handleVoidPayment();
            _handleLogin();
            _loadTable3();
            _typeAheadSearch();
            _handleCheckPayment();
            _handleEppPayment();
            _resetOrderPayment();
            _countOR();
            $("#notifOR").hide(0);
            $("#loginFailedMsg").hide(0);
            $("#authFailedMsg").hide(0);
            $("#divBplo").hide(0);

            //$("#tbl_bplo").DataTable();
		}
	};
}();

jQuery(document).ready(function () {
	KTPayment.init();
});
