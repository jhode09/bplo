"use strict";
// Class definition
menuActive('li-menu-cenro', 'li-submenu-bplo-cenro', 'li-submenu-cenro-permit');

var KTCenro = function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

     $('#btn_print').click(function(){
        try{ 
            var oIframe = document.getElementById('docpdfList');
            var oContent = document.getElementById('divToPrint').innerHTML;
            var oDoc = (oIframe.contentWindow || oIframe.contentDocument);
            if (oDoc.document) oDoc = oDoc.document;
            oDoc.write(`<html>
                            <head>
                                <style>
                                    @page {
                                       size: landscape;
                                       margin: 0;
                                    }
                                    #cert_body{
                                        position: absolute !important;  
                                        z-index: 1 !important;
                                        position: absolute !important;
                                        left: 10px !important;
                                        right: 0 !important; 
                                        top:300px !important;
                                    } 
                                    #business_name{
                                        font-size:30px !important;
                                        text-align:center !important;
                                    }
                                    .withaddress{
                                        text-transform:italic !important;
                                        text-align:center !important;
                                    }
                                    #business_address{
                                        text-align:center !important;
                                        font-size:20px !important;
                                        margin-top: 10px !important;
                                        font-family: Arial;
                                        color:#333;
                                    }
                                    #cert_content{
                                        margin-left:40px !important;
                                        margin-right:40px !important;
                                        font-size:20px !important;
                                        padding: 20px!important;
                                    }
                                    #cert_content p{
                                        text-indent:30px !important;
                                        font-family: Arial, sans-serif;
                                        font-size: 20px !important;
                                    }
                                    #back{
                                        top:185% !important;
                                        position: absolute;  
                                        z-index: 1;
                                        position: absolute;
                                        left: 63px;
                                    }
                                    #back.row{
                                        display:-webkit-box;
                                        display:-ms-flexbox;
                                        display:flex;
                                        -ms-flex-wrap:wrap;
                                        flex-wrap:wrap;
                                        margin-right:-15px;
                                        margin-left:-15px
                                    }
                                    #left,#right{
                                        width:50% !important;
                                    }

                                </style>
                            </head>
                        <body onload='this.focus(); this.print();'>`+ oContent + `</body></html>`);     

            oDoc.close();       

        }
        catch(e){
            self.print();
        }
    })


    var loadRecentAssessment = function(){
        $('#kt_datatable').DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            language: {                
                infoFiltered: ""
            },
            destroy: true,
            ajax : {
                type: 'post',
                url : fetch_assessment_history_url
            },
            columns : [
                { 
                    data : null,
                    name : 'actions',
                    render : function (data, type, row, meta){
                        return  `<span class="pl-0">
                                    <span class="text-dark-75 font-weight-bolder d-block font-size-lg">`+data.business_name+`</span>
                                    <span class="text-muted font-weight-bold">`+data.business_id+`</span>
                                </span>`;
                    }
                },
                { data: 'barangay' },
                { 
                    data: null, 
                    name:'actions',
                    render: function(data, type, row, meta){
                       return  moment(data.date_recorded).format("MMMM D ,YYYY");
                    }
                },

                {
                    data : null,
                    name : 'actions',
                    render : function (data,type,row,meta)
                    {
                       switch(data.is_complied)
                        {
                            case 1 : 
                                return '<span class="label label-inline label-light-success font-weight-bold"> Complied</span>';
                            break;

                            case 2 : 
                                return '<span class="label label-inline label-light-primary font-weight-bold"> Not Complied </span>';
                            break;
                        }
                    }
                },
                {
                    data : null,
                    name : 'actions',
                    render : function (data,type,row,meta)
                    {
                       switch(data.status)
                        {
                            case 1 : 
                                return '<span class="label label-inline label-light-success font-weight-bold"> Business Closure</span>';
                            break;
                            case 2 : 
                                return '<span class="label label-inline label-light-primary font-weight-bold">Re-assessment </span>';
                            break;
                            case 3 : 
                                return '<span class="label label-inline label-light-warning font-weight-bold"> New Permit</span>';
                            break;
                            case 4 : 
                                return '<span class="label label-inline label-light-info font-weight-bold"> Renew Permit</span>';
                            break;
                            case 5 :
                                return '<span class="label label-inline label-light-danger font-weight-bold"> Special Permit </span>';
                            break;
                        }
                    }
                },
                {   
                    data : null,
                    name : 'actions',
                    render : function (data,type,row,meta)
                    {
                        var nb_link = '/cenro/cenro-nb-permit/' + data.assessment_id;
                        var ob_link = '/cenro/cenro-ob-permit/' + data.assessment_id;
                        if (data.status == 4) { //Renew
                            return `<span style="overflow: visible; position: relative; width: 125px;">
                                <div class="dropdown dropdown-inline" data-toggle="tooltip" data-title="Settings">
                                    <a href="javascript:;" class="btn btn-sm btn-clean btn-icon mr-2" data-toggle="dropdown">
                                        <span class="svg-icon svg-icon-md">
                                            <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                    <rect x="0" y="0" width="24" height="24"></rect>
                                                    <path d="M5,8.6862915 L5,5 L8.6862915,5 L11.5857864,2.10050506 L14.4852814,5 L19,5 L19,9.51471863 L21.4852814,12 L19,14.4852814 L19,19 L14.4852814,19 L11.5857864,21.8994949 L8.6862915,19 L5,19 L5,15.3137085 L1.6862915,12 L5,8.6862915 Z M12,15 C13.6568542,15 15,13.6568542 15,12 C15,10.3431458 13.6568542,9 12,9 C10.3431458,9 9,10.3431458 9,12 C9,13.6568542 10.3431458,15 12,15 Z" fill="#000000"></path>'+
                                                </g>
                                            </svg>
                                        </span>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                                        <ul class="navi flex-column navi-hover py-2">
                                            <li class="navi-header font-weight-bolder text-uppercase font-size-xs text-primary pb-2">Choose an action:
                                            </li>

                                            <li class="navi-item">
                                                <a type="button" class="navi-link assessment" href="/cenro/cenro-permits-temp/` 
                                                        +data.assessment_id + `">
                                                    <span class="navi-icon"><i class="la la-print"></i></span>
                                                    <span class="navi-text">Temporary Permit</span>
                                                </a>
                                            </li>
                                            
                                            <li class="navi-item">
                                                <a type="button" class="navi-link assessment" href="`+ob_link
                                                    +`">
                                                    <span class="navi-icon"><i class="la la-print"></i></span>
                                                    <span class="navi-text">Official Permit</span>
                                                </a>
                                            </li>                                            
                                        </ul>
                                    </div>
                                </div>`
                        }else if(data.status == 3){//New
                            return `<span style="overflow: visible; position: relative; width: 125px;">
                                <div class="dropdown dropdown-inline" data-toggle="tooltip" data-title="Settings">
                                    <a href="javascript:;" class="btn btn-sm btn-clean btn-icon mr-2" data-toggle="dropdown">
                                        <span class="svg-icon svg-icon-md">
                                            <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                    <rect x="0" y="0" width="24" height="24"></rect>
                                                    <path d="M5,8.6862915 L5,5 L8.6862915,5 L11.5857864,2.10050506 L14.4852814,5 L19,5 L19,9.51471863 L21.4852814,12 L19,14.4852814 L19,19 L14.4852814,19 L11.5857864,21.8994949 L8.6862915,19 L5,19 L5,15.3137085 L1.6862915,12 L5,8.6862915 Z M12,15 C13.6568542,15 15,13.6568542 15,12 C15,10.3431458 13.6568542,9 12,9 C10.3431458,9 9,10.3431458 9,12 C9,13.6568542 10.3431458,15 12,15 Z" fill="#000000"></path>'+
                                                </g>
                                            </svg>
                                        </span>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                                        <ul class="navi flex-column navi-hover py-2">
                                            <li class="navi-header font-weight-bolder text-uppercase font-size-xs text-primary pb-2">Choose an action:
                                            </li>

                                            <li class="navi-item">
                                                <a type="button" class="navi-link assessment" href="/cenro/cenro-permits-temp/` 
                                                        +data.assessment_id + `">
                                                    <span class="navi-icon"><i class="la la-print"></i></span>
                                                    <span class="navi-text">Temporary Permit</span>
                                                </a>
                                            </li>
                                            
                                            <li class="navi-item">
                                                <a type="button" class="navi-link assessment" href="`+nb_link
                                                    +`">
                                                    <span class="navi-icon"><i class="la la-print"></i></span>
                                                    <span class="navi-text">Official Permit</span>
                                                </a>
                                            </li>                                            
                                        </ul>
                                    </div>
                                </div>`
                        }
                    }

                }
            ]
       });
    }

    return {
        // public functions
        init: function() {
            loadRecentAssessment();
        }
    };

}();



// Initialization
jQuery(document).ready(function() {
    KTCenro.init();
});