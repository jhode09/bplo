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

    $('[name=txt_search]').keypress(function(e){
        if(e.which == 13){//Enter key pressed
            $('#btn_search').click();//Trigger search button click event
        }
    });

    var fetchBussDetails = function(genID) {
        $.ajax({
            url: fetch_cenro_permit_url,
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
                $('#business_name').text("");
                $.each(res, function(index, value){
                    $('#business_name').text(res.row.buss_name);
                })

                console.log(res[1]);
            },
            error:function(a,b,c) {
                forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
            }
        })
    }

    
    $('#sel_businessType').on('change', function(){
        var select = $(this).find(":selected").val();
        if (select == "new") {
            $('#cert_back').removeAttr('src');
            $("#cert_back").attr('src', "{{URL::asset('assets/media/bg/cenro_cert_bg_nb_back.jpg')}}");
            $('#cert_font').removeAttr('src');
            $("#cert_font").attr('src', "{{URL::asset('assets/media/bg/cenro_cert_bg_nb_front.jpg')}}");
            $('#cert_content').html(`
                    <p style="text-indent: 30px;">This Clearance shall not exempt the proponent from any requirements or compliance with applicable environmenal laws, rules and regulations including the permitting requirements of other government agencies.
                    </p>
                    <p style="text-indent: 30px;">Non-compliance with any of the terms and conditions stated herein (at the back) shall be sufficient grounds for sanctions as may be deemed necessary and appropriate. This clearance shall be valid till end of the current year and shall be renewed annually.</p>


                `);
        }
        else{
            $('#cert_back').removeAttr('src');
            $("#cert_back").attr('src', "{{URL::asset('assets/media/bg/cenro_cert_bg_ob_back.jpg')}}");
            $('#cert_font').removeAttr('src');
            $("#cert_font").attr('src', "{{URL::asset('assets/media/bg/cenro_cert_bg_ob_front.jpg')}}");
            $('#cert_content').html(`
                    <p style="text-indent: 30px;">This Clearance shall not exempt the proponent from any requirements or compliance with applicable environmental laws, rules and regulations including the permitting requirements of other government agencies. </p>
                    <p style="text-indent: 30px;">Non-compliance with any of the terms and conditions stated herein (at the back) shall be sufficient grounds for the cancellation and for revocation of Business permit or other sanctions as mat be deemed necessary and appropriate. This clearance be valid till end of the current year and shall be renewed annually.</p>
                                

                `);
        }
    })
    $('#print').click(function(){
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