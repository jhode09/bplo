"use strict";
// Class definition
menuActive('li-menu-bplo', 'li-submenu-bplo-releasing');
var table, table2;
var KTReleasing = function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    var _onLoad = function() {
    };

    var _loadTable3 = function() {

        if( table ) { 
            table.clear();
            table.destroy(); 
        }

        table = $('#tbl_releasing').DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            language: {                
                infoFiltered: ""
            },
            ajax: {
                method : "POST",
                url    : fetch_releasinglist_url,
                data: {
                    columnsDef: [
                        'DT_RowIndex', 
                        'GenID', 
                        'BussName',
                        'Brgy',
                        null,
                        null,
                        null, 
                        'AssessDate', 
                        'Status', 
                        null
                    ],
                },
            },
            columns: [
                {data: 'DT_RowIndex'},
                {data: 'GenID'},
                {data: 'BussName'},
                {data: 'Brgy'},
                {data: null},
                {data: null},
                {data: null},
                {data: 'AssessDate'},
                {data: 'Status'},
                {data: null, orderable: false, searchable: false},
            ],
            columnDefs: [
                {   
                    targets: 5,
                    render: function( data, type, row ) {
                        var permit_number = (data.PermitNumber) ? data.PermitNumber : "--";
                        return permit_number;
                    }
                },
                {   
                    targets: 6,
                    render: function( data, type, row ) {
                        var top_number = (data.TOPNumber) ? data.TOPNumber : "--";
                        return top_number;
                    }
                },
                {   
                    targets: 4,
                    render: function( data, type, row ) {
                        var status = {
                            3: {'title': 'New', 'class': 'label-light-info'},
                            4: {'title': 'Renew', 'class': ' label-light-primary'},
                            1: {'title': 'Closure', 'class': ' label-light-danger'},
                        };
                    
                        return '<span class="label ' + status[row.Status].class + ' label-inline font-weight-bold label-lg">' + status[row.Status].title + '</span>';
                    }
                },
                {   
                    targets: 8,
                    render: function( data, type, row ) {
                        var status = {
                            0: {'title': 'Not Verified', 'class': ' label-light-danger'},
                            1: {'title': 'Verified', 'class': 'label-light-success'},
                        };
                    
                        return '<span class="label ' + status[row.Verified].class + ' label-inline font-weight-bold label-lg">' + status[row.Verified].title + '</span>';
                    }
                },
                {   
                    targets: 9 ,
                    title: "Action",
                    render: function( data, type, row ) {
                        var output = "";
                        return `<div class="dropdown dropdown-inline" data-toggle="tooltip" data-title="Permit & Certificate">
                                    <a href="javascript:;" class="btn btn-sm btn-clean btn-icon mr-2" data-toggle="dropdown">    <span class="svg-icon svg-icon-md">
                                            <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                    <rect x="0" y="0" width="24" height="24"/>
                                                    <path d="M16,17 L16,21 C16,21.5522847 15.5522847,22 15,22 L9,22 C8.44771525,22 8,21.5522847 8,21 L8,17 L5,17 C3.8954305,17 3,16.1045695 3,15 L3,8 C3,6.8954305 3.8954305,6 5,6 L19,6 C20.1045695,6 21,6.8954305 21,8 L21,15 C21,16.1045695 20.1045695,17 19,17 L16,17 Z M17.5,11 C18.3284271,11 19,10.3284271 19,9.5 C19,8.67157288 18.3284271,8 17.5,8 C16.6715729,8 16,8.67157288 16,9.5 C16,10.3284271 16.6715729,11 17.5,11 Z M10,14 L10,20 L14,20 L14,14 L10,14 Z" fill="#000000"/>
                                                    <rect fill="#000000" opacity="0.3" x="8" y="2" width="8" height="2" rx="1"/>
                                                </g>
                                            </svg>
                                        </span>
                                   </a>
                                   <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                                       <ul class="navi flex-column navi-hover py-2">
                                           <li class="navi-header font-weight-bolder text-uppercase font-size-xs text-primary pb-2">Permit & Certificates:
                                            </li>
                                            <li class="navi-item">
                                                <a href="/bplo/permit-temporary/`+data.AssessID+`" class="navi-link" type="button">
                                                    <span class="navi-text">Temporary Permit</span>
                                                </a>
                                            </li>
                                            <li class="navi-item">
                                                <a href="/bplo/permit-official/`+data.AssessID+`" class="navi-link" type="button">
                                                    <span class="navi-text">Official Permit</span>
                                                </a>
                                            </li>
                                    
                                        </ul>
                                    </div>
                                </div>`;
                    }
                },
                
            ]
        });
    };

    var _loadTable4 = function() {

        if( table2 ) { 
            table2.clear();
            table2.destroy(); 
        }

        table2 = $('#tbl_history').DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            language: {                
                infoFiltered: ""
            },
            ajax: {
                method : "POST",
                url    : fetch_donereleaselist_url,
                data: {
                    columnsDef: [
                        'DT_RowIndex', 
                        'GenID', 
                        'BussName',
                        'Brgy',
                        null,
                        null,
                        null, 
                        'AssessDate', 
                        'permit_status', 
                        'emp_fname', 
                        null
                    ],
                },
            },
            columns: [
                {data: 'DT_RowIndex'},
                {data: 'GenID'},
                {data: 'BussName'},
                {data: 'Brgy'},
                {data: null},
                {data: null},
                {data: null},
                {data: 'date_printed'},
                {data: 'permit_status'},
                {data: 'emp_fname'},
                {data: null, orderable: false, searchable: false},
            ],
            columnDefs: [
                {   
                    targets: 5,
                    render: function( data, type, row ) {
                        var permit_number = (data.permit_no) ? data.permit_no : "--";
                        return permit_number;
                    }
                },
                {   
                    targets: 6,
                    render: function( data, type, row ) {
                        var top_number = (data.TOPNumber) ? data.TOPNumber : "--";
                        return top_number;
                    }
                },
                {   
                    targets: 4,
                    render: function( data, type, row ) {
                        var permit_status = {
                            1: {'title': 'Official Permit', 'class': ' label-light-success'},
                            2: {'title': 'Temporary', 'class': 'label-light-danger'},

                        };
                    
                        return '<span class="label ' + permit_status[row.permit_status].class + ' label-inline font-weight-bold label-lg">' + status[row.permit_status].title + '</span>';
                    }
                },
                {   
                    targets: 8,
                    render: function( data, type, row ) {
                        var status = {
                            0: {'title': 'Not Verified', 'class': ' label-light-danger'},
                            1: {'title': 'Verified', 'class': 'label-light-success'},
                        };
                    
                        return '<span class="label ' + status[row.Verified].class + ' label-inline font-weight-bold label-lg">' + status[row.Verified].title + '</span>';
                    }
                },
                {   
                    targets: 10 ,
                    title: "Action",
                    render: function( data, type, row ) {
                        var output = "";
                        return `<div class="dropdown dropdown-inline" data-toggle="tooltip" data-title="Permit & Certificate">
                                    <a href="javascript:;" class="btn btn-sm btn-clean btn-icon mr-2" data-toggle="dropdown">    <span class="svg-icon svg-icon-md">
                                            <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                    <rect x="0" y="0" width="24" height="24"/>
                                                    <path d="M16,17 L16,21 C16,21.5522847 15.5522847,22 15,22 L9,22 C8.44771525,22 8,21.5522847 8,21 L8,17 L5,17 C3.8954305,17 3,16.1045695 3,15 L3,8 C3,6.8954305 3.8954305,6 5,6 L19,6 C20.1045695,6 21,6.8954305 21,8 L21,15 C21,16.1045695 20.1045695,17 19,17 L16,17 Z M17.5,11 C18.3284271,11 19,10.3284271 19,9.5 C19,8.67157288 18.3284271,8 17.5,8 C16.6715729,8 16,8.67157288 16,9.5 C16,10.3284271 16.6715729,11 17.5,11 Z M10,14 L10,20 L14,20 L14,14 L10,14 Z" fill="#000000"/>
                                                    <rect fill="#000000" opacity="0.3" x="8" y="2" width="8" height="2" rx="1"/>
                                                </g>
                                            </svg>
                                        </span>
                                   </a>
                                   <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                                       <ul class="navi flex-column navi-hover py-2">
                                           <li class="navi-header font-weight-bolder text-uppercase font-size-xs text-primary pb-2">Permit & Certificates:
                                            </li>
                                            <li class="navi-item">
                                                <a href="/bplo/permit-temporary/`+data.AssessID+`" class="navi-link" type="button">
                                                    <span class="navi-text">Reprint Temporary Permit</span>
                                                </a>
                                            </li>
                                            <li class="navi-item">
                                                <a href="/bplo/permit-official/`+data.AssessID+`" class="navi-link" type="button">
                                                    <span class="navi-text">Reprint Official Permit</span>
                                                </a>
                                            </li>
                                    
                                        </ul>
                                    </div>
                                </div>`;
                    }
                },
                
            ]
        });
    };

    return {
        // public functions
        init: function() {
            _onLoad();
            _loadTable3();
            _loadTable4();
        }
    };

}();

// Initialization
jQuery(document).ready(function() {
    KTReleasing.init();
});