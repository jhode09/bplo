"use strict";

var table1, table2;
var total = 0;

menuActive('li-menu-cashiering', 'li-submenu-cashiering-reports', 'li-lastmenu-cashiering-reports-detailed');


// Class definition
var KTDetailedReports = function () {

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

    var _formatDate = function(date) {
    	var arrDate = date.split(" - ");
    	var start   = arrDate[0].split("/");
    	var end     = arrDate[1].split("/");
    	var s 		= new Date(start[2], (start[0] - 1), start[1]).toString();
    	var e   	= new Date(end[2], (end[0] - 1), end[1]).toString();
    	s = s.split(" ");
    	e = e.split(" ");
    	$("#dateLabel").text(" for " + s[1] + ". " + s[2] + ", " + s[3] + " - " + e[1] + ". " + e[2] + ", " + e[3]);
        $("#dateCaption").text(s[1] + ". " + s[2] + ", " + s[3] + " - " + e[1] + ". " + e[2] + ", " + e[3]);
    };

    var _commaSeparateNumber = function (val){
        while (/(\d+)(\d{3})/.test(val.toString())){
            val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        return val;
    };

    var _loadSubAcct = function(date) {

        if( table1 ) { 
            table1.clear();
            table1.destroy(); 
        }

        table1 = $('#tbl_subacct_reports').DataTable({
            processing: true,
            serverSide: true,
            info: false,
            paging:true,
            /*
                dom: `<'row'<'col-sm-6 text-left'f><'col-sm-6 text-right'B>>
                <'row'<'col-sm-12'tr>>
                <'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,
                buttons: [
                    'print',
                    'copyHtml5',
                    'excelHtml5',
                    'csvHtml5',
                    'pdfHtml5',
                ],
            */
            ajax: {
                data   : { date : date },
                method : "POST",
                url    : fetch_subacct_report
            },
            columns: [
                {
                    data: 'SubAcctCode',
                    width: 120,
                    name: 'SubAcctCode'
                },
                {
                    data: 'SubAcctName',
                    name: 'SubAcctName'
                },
                {   
                    data: null,
                    title:"Amount",
                    orderable: false,
                    render: function( data, type, row, meta ) {
                        return "<div class='text-right'>₱ "+ data.Amount +"</div>";
                    }
                },
            ],
            rowGroup: {
                //dataSrc: 'AcctTitle'
                dataSrc: function ( row ) {
                    return row.AcctTitle + " ("+row.AcctCode+")";
                }
            }
        });
    };

    var _loadCoa = function(date) {

        total = 0;

        if( table2 ) { 
            table2.clear();
            table2.destroy(); 
        }

        table2 = $('#tbl_coa_reports').DataTable({
            // initComplete: function(a, b) {
            //     console.log(b);
            //     console.log(b.data.Amount);
            // },
            processing: true,
            serverSide: true,
            info: false,
            paging:true,
            ajax: {
                data   : { date : date },
                method : "POST",
                url    : fetch_subacct_report
            },
            columns: [
                {
                    data: 'AcctCode',
                    width: 120,
                    name: 'AcctCode'
                },
                {
                    data: 'AcctTitle',
                    name: 'AcctTitle'
                },
                {   
                    data: null,
                    title:"Amount",
                    orderable: false,
                    render: function( data, type, row, meta ) {
                        return "<div class='text-right'>₱ "+ data.Amount +"</div>";
                    }
                },
            ]
        });

        //$("#total").text(total);
    };

    $("#subAcctNav").click(function(){
        _loadSubAcct($('#dateRange .form-control').val());
    })
    $("#coaNav").click(function(){
        _loadCoa($('#dateRange .form-control').val());
    })

    $("#btnFilter").click(function(){
        _loadSubAcct($('#dateRange .form-control').val());
        _loadCoa($('#dateRange .form-control').val());
		_formatDate($('#dateRange .form-control').val());
    });

	return {
		// public functions
		init: function () {
			_onLoad();
            _loadSubAcct($('#dateRange .form-control').val());
            _loadCoa($('#dateRange .form-control').val());
			_formatDate($('#dateRange .form-control').val());
		}
	};
}();

jQuery(document).ready(function () {
	KTDetailedReports.init();
});
