"use strict";
var table;

//Adding Class of Nav to become active
menuActive('li-menu-tools', 'li-submenu-tools-usermgt', 'li-lastmenu-tools-usermgt-actrl-list');

//View Privilege Details
var KTViewPrivDetails = function(id) {
    $.ajax({
        url : fetch_privdetails_url,
        type: 'post',
        data: { id : id},
        beforeSend: function(){
            _beforeSend();
        },
        complete: function(){
            _complete();
        },
        success:function(res) {
            $("#divEmpPriv").empty();
            $("#divEmpPriv").append(res);
            $("#empPrivModal").modal('show');
        }
    })
}

// Class definition
var KTAControlList = function () {


	$.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

	
    
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
                url    : fetch_emppriv_url,
                data: {
                    columnsDef: [
                        'DT_RowIndex', 
                        null, 
                        'FullName', 
                        null, 
                        'Birthday', 
                        'Email', 
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
                                        <a href="#" class="text-muted text-hover-primary">` + 'asd' + `</a>\
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

	return {
		// public functions
		init: function () {
			_loadTable();
		}
	};

}();

jQuery(document).ready(function () {
	KTAControlList.init();
});
