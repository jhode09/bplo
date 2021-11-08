"use strict";

var table;

menuActive('li-menu-cashiering', 'li-submenu-cashiering-trans');

var KTViewDetails = function(id) {
    $.ajax({
        url : fetch_transdetails_url,
        type: "post",
        data: {id : id},
        beforeSend: function(){
            _beforeSend();
        },
        complete: function() {
            _complete();
        },
        success:function(res) {
            if(res != "not_found") {
                var transType  = res[0].TransType;

                if(transType === "ORDERPAYMENT" || transType === "UPDATEORDERPAYMENT") {
                    $("#orderPaymentDetails").empty();
                    var output          = "";
                    var transCode       = res[0].TransCode;
                    var recipientName   = res[0].RecipientName;
                    var total           = res[0].TotalAmount;

                    var status = {
                        0: {'title': 'UNPROCESSED', 'class': 'label-light-danger'},
                        1: {'title': 'PROCESSED', 'class': 'label-light-primary'},
                        2: {'title': 'UPDATED', 'class': 'label-light-warning'},
                    };


                    output += "<div class='row'>";
                    for (var i = 0; i < res.length; i++) {
                        output  += "<div class='col-lg-4'><span class='label label-dot label-dark mr-2'></span>"    + res[i].SubAcctTitle + "</div>";
                        output  += "<div class='col-lg-8 mb-2'> ₱ " + res[i].Amount + " x " + parseInt(res[i].Qty) + "</div>";
                    }
                    output += "</div>";
                    output += "<div class='col-lg-12 separator separator-solid mb-2'></div>";

                    $("#opTransCode").text(transCode);
                    $("#opTransType").html("<span class='label label-light-primary label-inline font-weight-bold label-lg'>ORDER PAYMENT</span>");
                    $("#opStatus").html('<span class="label ' + status[res[0].OPStatus].class + ' label-inline font-weight-bold label-lg">' + status[res[0].OPStatus].title + '</span>');
                    $("#opRecipient").text(recipientName);
                    $("#opTotalAmount").text(total);
                    $("#orderPaymentDetails").append(output);
                
                    if(res[0].OPStatus == 1) {
                        $("#divProcessDate").show(0);
                        $("#orderPaymentProcessDate").text(res[0].ProcessDate);
                    } else {
                        $("#divProcessDate").hide(0);
                    }
                    
                    $("#orderPaymentDetailsModal").modal('show');
                } 

                else if(transType === "PAYMENT") {

                    $("#paymentDetails").empty();
                    var output          = "";
                    var transCode       = res[0].TransCode;
                    var recipientName   = res[0].RecipientName;
                    var total           = res[0].TotalAmount;
                    var paymentDate     = res[0].PaymentDate;

                    var status = {
                        0: {'title': 'PAID', 'class': 'label-light-primary'},
                        1: {'title': 'VOID', 'class': 'label-light-danger'}
                    };

                    output += "<div class='row'>";
                    for (var i = 0; i < res.length; i++) {
                        output  += "<div class='col-lg-4'><span class='label label-dot label-dark mr-2'></span>"    + res[i].SubAcctTitle + "</div>";
                        output  += "<div class='col-lg-8 mb-2'> ₱ " + res[i].Amount + " x " + parseInt(res[i].Qty) + "</div>";
                    }
                    output += "</div>";
                    output += "<div class='col-lg-12 separator separator-solid mb-2'></div>";

                    $("#pTransCode").text(transCode);
                    $("#pTransType").html("<span class='label label-light-success label-inline font-weight-bold label-lg'>PAYMENT</span>");
                    $("#pStatus").html('<span class="label ' + status[res[0].PStatus].class + ' label-inline font-weight-bold label-lg">' + status[res[0].PStatus].title + '</span>');
                    $("#pRecipient").text(recipientName);
                    $("#pTotalAmount").text(total);
                    $("#paymentDetails").append(output);
                    $("#paymentDate").text(paymentDate);
                    $("#paymentDetailsModal").modal('show');
                }

                else if(transType === "VOIDPAYMENT") {

                    $("#voidPaymentDetails").empty();
                    var output          = "";
                    var transCode       = res[0].TransCode;
                    var recipientName   = res[0].RecipientName;
                    var reasons         = res[0].Reasons
                    var total           = res[0].TotalAmount;
                    var voidPaymentDate = res[0].VoidPaymentDate;

                    output += "<div class='row'>";
                    for (var i = 0; i < res.length; i++) {
                        output  += "<div class='col-lg-4'><span class='label label-dot label-dark mr-2'></span>"    + res[i].SubAcctTitle + "</div>";
                        output  += "<div class='col-lg-8 mb-2'> ₱ " + res[i].Amount + " x " + parseInt(res[i].Qty) + "</div>";
                    }
                    output += "</div>";
                    output += "<div class='col-lg-12 separator separator-solid mb-2'></div>";

                    $("#vpTransCode").text(transCode);
                    $("#vpTransType").html("<span class='label label-light-danger label-inline font-weight-bold label-lg'>VOID PAYMENT</span>");
                    $("#vpReasons").text(reasons);
                    $("#vpRecipient").text(recipientName);
                    $("#vpTotalAmount").text(total);
                    $("#voidPaymentDetails").append(output);
                    $("#voidPaymentDate").text(voidPaymentDate);
                    $("#voidPaymentDetailsModal").modal('show');
                }

            } else {
                forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
            }
        },
        error: function(a,b,c) {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    })
}

// Class definition
var KTTransaction = function () {

	//Set Up Ajax CSRF
	$.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    var _searchType = function(type, id) {
        $(".dropdown-item").removeClass('active');
        $(id).addClass("active");
        _loadTable(type);
    }

    $("#allTrans").click(function(){
        _searchType('', '#allTrans');
    })

    $("#orderPaymentType").click(function(){
        _searchType('ORDERPAYMENT', '#orderPaymentType');
    })

    $("#paymentType").click(function(){
        _searchType('PAYMENT', '#paymentType');
    })

    $("#voidPaymentType").click(function(){
        _searchType('VOIDPAYMENT', '#voidPaymentType');
    })

    $("#updateOrderPaymentType").click(function(){
        _searchType('UPDATEORDERPAYMENT', '#updateOrderPaymentType');
    })

    //Load DataTable
    var _loadTable = function(transType) {

    	if( table ) { 
    		table.clear();
    		table.destroy(); 
    	}

        table = $('#tbl_trans').DataTable({
        	responsive: true,
            processing: true,
            serverSide: true,
            language: {                
	            infoFiltered: ""
	        },
            ajax: {
                method : "POST",
                url    : fetch_trans_url,
                data: {
                    transType: transType,
					columnsDef: [
                        'DT_RowIndex',
                        'TransCode',
                        'TransType',
                        null, 
						'TrxDate', 
                        'CreatedBy', 
                        'Action'
                    ],
				},
            },
            columns: [
            	{data: 'DT_RowIndex'},
				{data: 'TransCode'},
                {data: 'TransType'},
                {data: null},
				{data: 'TrxDate'},
				{data: 'CreatedBy'},
				{data: 'Action', orderable:false, searchable:false},
			]
            ,
            columnDefs: [
                {   
                    targets: 2,
                    render: function( data, type, row ) {
                        var transType = row.TransType;
                        var type = {
                            'ORDERPAYMENT': {'title': 'ORDER PAYMENT', 'class': 'label-light-primary'},
							"PAYMENT": {'title': 'PAYMENT', 'class': 'label-light-success'},
							'VOIDPAYMENT': {'title': 'VOID PAYMENT', 'class': 'label-light-danger'},
                            'UPDATEORDERPAYMENT': {'title': 'UPDATE ORDER PAYMENT', 'class': 'label-light-warning'},
						};
                        return '<span class="label ' + type[transType].class + ' label-inline font-weight-bold label-lg mr-2">' + type[transType].title + '</span>';
                    }
                },
                {   
                    targets: 3,
                    render: function( data, type, row ) {
                        var transType = row.TransType;
                        if(transType === "ORDERPAYMENT" || transType === "UPDATEORDERPAYMENT") {
                            var opStatus = {
                                0: {'title': 'Unprocess', 'class': 'label-light-danger'},
                                1: {'title': 'Processed', 'class': 'label-light-primary'},
                                2: {'title': 'Updated', 'class': 'label-light-warning'},
                            };
                            return '<span class="label ' + opStatus[row.OPStatus].class + ' label-inline font-weight-bold label-md ml-2">' + opStatus[row.OPStatus].title + '</span>';
                        } else if (transType === "PAYMENT") {
                            var pStatus = {
                                0: {'title': 'Paid', 'class': 'label-light-primary'},
                                1: {'title': 'Void', 'class': 'label-light-danger'}
                            };
                            return '<span class="label ' + pStatus[row.PStatus].class + ' label-inline font-weight-bold label-md ml-2">' + pStatus[row.PStatus].title + '</span>';
                        } else {
                            return "---";
                        }
                    }
                },
            ]
        });
    };

	return {
		// public functions
		init: function () {
			_loadTable("");
		}
	};
}();

jQuery(document).ready(function () {
	KTTransaction.init();
});
