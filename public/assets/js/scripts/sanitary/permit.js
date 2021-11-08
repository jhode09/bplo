"use strict";
// Class definition
menuActive('li-menu-sanitary', 'li-submenu-bplo-sanitary', 'li-submenu-sanitary-permit');

var KTSanitary = function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
     $('[name=selOffice]').on('change',function(){
        var selected = $(this).val();
        if(selected == 'office_1'){
            $('#cert_bg').attr('src', "/assets/media/bg/sanitary_cert_bg.jpg")
            $('#officer_position').text('City Health Officer - I');
            $('#officer_name').text('ELENA C. DIAMANTE, MD, MPH');

        }
        else{
            $('#cert_bg').attr('src', "/assets/media/bg/sanitary_cert_bg2.jpg")
            $('#officer_position').text('City Health Officer - II');
            $('#officer_name').text('CECIL ARNOLD G. AGUILLO, MD');

        }
    })

    $('#btn_print').on('click',function(){
        $('#dateIssuance').text($('[name=dateIssuance]').val());
        $('#dateExpiration').text($('[name=dateExpiration]').val());
        $('#permitNum').text($('[name=cert_permit_no]').val());
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
                                        left: 0px !important;
                                        right: 0 !important; 
                                        top:30px !important;
                                        font-family:'Poppins', sans-serif;
                                    } 
                                    .cert_content{
                                        z-index: 1;
                                        position: absolute;
                                        left:20px;
                                        right: 0; 
                                        top:300px !important;
                                        padding-left:70px !important;
                                        padding-right:70px !important;
                                    }
                                    #business_name{
                                        font-size:20px !important;
                                        margin-top:20px !important;
                                    }
                                    .text-uppercase{
                                        text-transform:uppercase;
                                    }
                                    .row{
                                        display:-webkit-box;
                                        display:-ms-flexbox;
                                        display:flex;
                                        -ms-flex-wrap:wrap;
                                        flex-wrap:wrap;
                                        margin-right:-15px;
                                        margin-left:-15px
                                    }
                                    .col-10{
                                        -webkit-box-flex:0;
                                        -ms-flex:0 0 83.333333%;
                                        flex:0 0 83.333333%;
                                        max-width:83.333333%;
                                    }
                                    .col-6{-webkit-box-flex:0;-ms-flex:0 0 50%;flex:0 0 50%;max-width:40%}
                                    .col-7{
                                        -webkit-box-flex:0;
                                        -ms-flex:0 0 58.333333%;
                                        flex:0 0 58.333333%;
                                        max-width:58.333333%;
                                    }
                                    .text-center{
                                        text-align:center !important
                                    }
                                    .pl-20, pr-20{padding:20px !important}
                                    .offset-1{margin-left:8.333333% !important}
                                    .offset-2{margin-left:16.666667%  !important}
                                    .offset-3{margin-left:25% !important}
                                    .offset-4{margin-left:33.333333% !important}
                                    small{font-size:70%;font-weight:400 !important}
                                    .h2{
                                        font-size:2rem;
                                        text-indent:25px !important;
                                        padding-top:20px !important;
                                        padding-left:20px !important;
                                        padding-right:50px !important;
                                    }

                                    .left{
                                        margin-right:100px !important;
                                        padding-left:20px !important;
                                        margin-top:13px !important;
                                    }
                                    .signatories{
                                        margin-top:20px !important;
                                        padding-left:50px !important;
                                        padding-right:50px !important;
                                    }
                                    .font-weight-bolder{
                                        font-weight:600;
                                    }
                                    .cert_footer{
                                        padding-left:28px !important;
                                        margin-top:50px !important;
                                    }
                                    .text-right{text-align:right!important}
                                    .col-5{-webkit-box-flex:0;-ms-flex:0 0 41.666667%;flex:0 0 41.666667%;max-width:41.666667%}
                                    i{text-transform:italic}
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
                { data: 'business_id' },
                { data: 'business_name' },
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
                       return `    <a href="/sanitary/sanitary-permits-offs/`+ data.assessment_id +`" class="btn btn-sm btn-hover text-center" >
                                        <span class="svg-icon svg-icon-md">
                                            <i class="la la-print"></i>
                                        </span>
                                        <span class="text-muted">Official Permit</span>
                                    </a>`
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
    KTSanitary.init();
});