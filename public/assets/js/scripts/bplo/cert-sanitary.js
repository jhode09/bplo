"use strict";
// Class definition
menuActive('li-menu-sanitary', 'li-submenu-bplo-sanitary', 'li-submenu-sanitary-permit');
// var AssementID;
// var BussID = "";
// var GenID  = "";
// var table1, table2, table3;
// var total = 0;
// var inspectionID = "";
 
var _commaSeparateNumber = function(val) {
        while (/(\d+)(\d{3})/.test(val.toString())){
          val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        return val;
    }


var KTSanitaryPermit = function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $('#btn_search').on('click', function(){
        var genID = $('[name=txt_search]').val();
        if (genID == "") {
            $('[name=txt_search]').focus();
        }
        else {
            fetchBussDetails(genID)
        }
    })

    var fetchBussDetails = function(genID) {
        $.ajax({
            url: fetch_business_permit_url,
            type: "post",
            data: { genID : genID },
            dataType: 'json',
            beforeSend: function(){
                _beforeSend();
            },
            complete: function(){
                _complete();
            },
            success:function(res) { 
                $.each(res, function(index, value){
                    $('#business_name').text(res.row.buss_name);
                    $('#business_nature').text(res.row.bussnature_desc);
                    $('#business_addr').text(res.row.buss_buildingno +" "+ 
                                             res.row.buss_street +  " " +
                                             res.row.buss_brgy +" "+ 
                                             res.row.buss_city + " "+ 
                                             res.row.buss_province);

                })

                console.log(res[1]);
            },
            error:function(a,b,c) {
                forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
            }
        })
    }

    $('[name=selOffice]').on('change',function(){
        var selected = $(this).val();
        if(selected == 'office_1'){
            $('#cert_bg').attr('src', "/assets/media/bg/sanitary_cert_bg.jpg")
            $('#officer_position').text('City Health Officer - I');
        }
        else{
            $('#cert_bg').attr('src', "/assets/media/bg/sanitary_cert_bg2.jpg")
            $('#officer_position').text('City Health Officer - II');

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
                                            margin-top:15px !important;
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
                                            margin-right:120px !important;
                                            padding-left:25px !important;
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


    return {
        // public functions
        init: function() {
            
          
        }
    };

}();



// Initialization
jQuery(document).ready(function() {
    KTSanitaryPermit.init();
});