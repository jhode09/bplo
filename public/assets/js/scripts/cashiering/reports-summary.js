"use strict";

var table1, table2;

menuActive('li-menu-cashiering', 'li-submenu-cashiering-reports', 'li-lastmenu-cashiering-reports-summary');


// Class definition
var KTSummaryReports = function () {

	$.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

	var _onLoad = function() {

		// predefined ranges
	    var start = moment().subtract(29, 'days');
	    var end = moment();

	    $('#dateRange').daterangepicker({
	        buttonClasses: ' btn',
	        applyClass: 'btn-primary',
	        cancelClass: 'btn-secondary',

	        startDate: start,
	        endDate: end,
	        ranges: {
	           'Today': [moment(), moment()],
	           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
	           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
	           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
	           'This Month': [moment().startOf('month'), moment().endOf('month')],
	           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
	        }
	    }, function(start, end, label) {
	        $('#dateRange .form-control').val( start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
	    });

	    $('#dateRange .form-control').val( start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
	};

	// Load Reports Data
	var _loadReports = function(date, collector) {
		$.ajax({
			url : fetch_reports_summary_url,
			type: "post",
			data: { date: date, collector: collector },
			beforeSend: function() {
				_beforeSend();
			},
			complete: function() {
				_complete();
			},
			success: function(res) {
				$("#OPEntries").text(res.OPEntries);
				$("#UOPEntries").text(res.UOPEntries);
				$("#PEntries").text(res.PEntries);
				$("#VPEntries").text(res.VPEntries);

				$("#OPAmount").text(res.OPAmount);
				$("#PAmount").text(res.PAmount);
				$("#VPAmount").text(res.VPAmount);
			},
			error: function(a,b,c) {
				forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
			}
		})
	};

	//Load DataTable Order Payment
    var _loadTableOP = function(date, collector) {

    	if( table1 ) { 
    		table1.clear();
    		table1.destroy(); 
    	}

        table1 = $('#tbl_orderpayment').DataTable({
        	responsive: true,
            processing: true,
            serverSide: true,
            info: false,
            paging: false,
            searching: false,
            language: {                
	            infoFiltered: ""
	        },
            ajax: {
                method : "POST",
                url    : fetch_oplist_report_url,
                data: {
                	date: date,
                	collector: collector,
					columnsDef: [
						'DT_RowIndex', 
						'TransCode', ,
						'CreatedAt', 
						'Status',
						'CreatedBy',
						null
					],
				},
            },
            columns: [
            	{data: 'DT_RowIndex'},
				{data: 'TransCode'},
				{data: 'CreatedAt'},
				{data: 'Status'},
				{data: 'CreatedBy'},
				{data: null},
			],
            columnDefs: [
            	{   
                    targets: 1,
                    title: "Trx Code",
                    render: function( data, type, row ) {
                    	return "<small>"+data+"</small>";
                    }
                },
                {   
                    targets: 3,
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
						return "₱ " + row.TotalAmount;
                    }
                },
                
            ]
        });
    };

    //Load DataTable Payment
    var _loadTableP = function(date, collector) {

    	if( table2 ) { 
    		table2.clear();
    		table2.destroy(); 
    	}

        table2 = $('#tbl_payment').DataTable({
        	responsive: true,
            processing: true,
            serverSide: true,
            info: false,
            paging: false,
            searching: false,
            language: {                
	            infoFiltered: ""
	        },
            ajax: {
                method : "POST",
                url    : fetch_plist_report_url,
                data: {
                	date: date,
                	collector: collector,
					columnsDef: [
						'DT_RowIndex', 
						'TransCode', 
						'TrxDate', 
						'Status', 
						'CreatedBy',
						null
					],
				},
            },
            columns: [
            	{data: 'DT_RowIndex'},
				{data: 'TransCode'},
				{data: 'TrxDate'},
				{data: 'Status'},
				{data: 'CreatedBy'},
				{data: null},
			],
            columnDefs: [
            	{   
                    targets: 1,
                    title: "Trx Code",
                    render: function( data, type, row ) {
                    	return "<small>"+data+"</small>";
                    }
                },
                {   
                    targets: 3,
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
                    targets: 5,
                    title: "Total Amount",
                    render: function( data, type, row ) {
                        return "₱ " + row.TotalAmount;
                    }
                },
                
            ]
        });
    };

    //Display Collector and Date Range
    var _displayLabels = function(date, collector) {
    	var arrDate = date.split(" - ");
    	var start   = arrDate[0].split("/");
    	var end     = arrDate[1].split("/");
    	var s 		= new Date(start[2], (start[0] - 1), start[1]).toString();
    	var e   	= new Date(end[2], (end[0] - 1), end[1]).toString();
    	collector   = ($("select[name='collector']").val() == "") ? "All Collectors" : "Collector - " + $("select[name='collector']").find(":selected").text();
    	s = s.split(" ");
    	e = e.split(" ");
    	$("#dateLabel").text(s[1] + ". " + s[2] + ", " + s[3] + " - " + e[1] + ". " + e[2] + ", " + e[3]);
    	$("#collectorLabel").text(collector);
    }

    $("#btnFilter").click(function(){
    	var date      = $('#dateRange .form-control').val();
    	var collector = $("select[name='collector']").val();
    	_loadReports(date, collector)
    	_loadTableOP(date, collector);
		_loadTableP(date, collector);
		_displayLabels(date, collector);
    });

	return {
		// public functions
		init: function () {
			_onLoad();
			_loadReports($('#dateRange .form-control').val(), $("select[name='collector']").val());
			_loadTableOP($('#dateRange .form-control').val(), $("select[name='collector']").val());
			_loadTableP($('#dateRange .form-control').val(), $("select[name='collector']").val());
			_displayLabels($('#dateRange .form-control').val(), $("select[name='collector']").val());
		}
	};
}();

jQuery(document).ready(function () {
	KTSummaryReports.init();
});
