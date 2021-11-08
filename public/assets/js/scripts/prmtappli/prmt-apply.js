"use strict";
// Class definition
menuActive('li-menu-bplo', 'li-submenu-permitapp', 'li-lastmenu-permitapp-createapp');


var KTCreatePermit = function () {

    //Setting up ajax for laravel
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    // Private functions
    var _onLoad = function() {
        $("#title").focus();

    };


    return {
        // public functions
        init: function() {
            _onLoad();
            // _handleCreateForm();
        }
    };

}();

var KTDisplayBarangay = function(id) {

    $.ajax({
       url: fetch_barangay_url,
        type: "post",
        data: {"code": id},
        success:function(res) { 
            var select = $('select[name="ownersBarangay"]');
            var option = "";
            console.log(res);
            $.each(res, function(index, value){
                option += `<option
                     class="`+ value.city_municipality_code+`
                     value="`+ value.barangay_description+`">
                     `+value.barangay_description+`
                </option>`;
            });

            select.empty();
            select.append(option);

        },
        error:function(a,b,c)
        {
            // forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    })
}

var KTDisplayBusinessLine = function(){
     var table = $('#kt_datatable').DataTable();
}



$(document).ready(function(){
    $('#transfer-details').hide();
    $('[name=iftransfer]').on('click', function(){
        var status = $('[name=iftransfer]:checked').val();
        if(status != "No"){
            $('#transfer-details').show();

            $('[name=transfertype]').attr("required");
            $('[name=transfrom]').attr('required');
            $('[name=transto]').attr('required');
        }
        else{
            $('#transfer-details').hide();
        }

        console.log(status);
    });

      $('#lessors_details').hide();
    $('.loc_type').on('click', function(){
        var b_location = $('[name=location_type]:checked').val();
        if(b_location != "Owned"){ //rent
            $('#lessors_details').show();
        }
        else{
            $('#lessors_details').hide();

        }

        console.log(b_location);
    });

    //Owners Address Select
   /* $('[name=ownersProvince]').attr('disabled',"true");
    $('[name=ownersMunicipality]').attr('disabled',"true");
    $('[name=ownersBarangay]').attr('disabled',"true");*/
    $('[name=lessorsProvince]').attr('disabled',"true");
    $('[name=lessorsMunicipality]').attr('disabled',"true");
    $('[name=lessorsBarangay]').attr('disabled',"true");

    $('[name=ownersRegion]').on('change', function(){
        $('[name=ownersProvince]').removeAttr('disabled');

        var regionCode = this.options[this.selectedIndex].id;
        $('[name=ownersProvince] option').hide();
        $('[name=ownersProvince]').children("option[class^="+regionCode + "]").show();
    });


    $('[name=ownersProvince]').on('change', function(){
        $('[name=ownersMunicipality]').removeAttr('disabled');

        var provinceCode = this.options[this.selectedIndex].id;
        $('[name=ownersMunicipality] option').hide();
        $('[name=ownersMunicipality]').children("option[class^="+provinceCode + "]").show();
    });

    $('[name=ownersMunicipality]').on('change', function(){
        $('[name=ownersBarangay]').removeAttr('disabled');

        var cityCode = this.options[this.selectedIndex].id;
         KTDisplayBarangay(cityCode);
    });


    $('[name=lessorsRegion]').on('change', function(){
        $('[name=lessorsProvince]').removeAttr('disabled');

        var regionCode = this.options[this.selectedIndex].id;
        $('[name=lessorsProvince] option').hide();
        $('[name=lessorsProvince]').children("option[class^="+regionCode + "]").show();
    });

    $('[name=lessorsProvince]').on('change', function(){
        $('[name=lessorsMunicipality]').removeAttr('disabled');

        var provinceCode = this.options[this.selectedIndex].id;
        $('[name=lessorsMunicipality] option').hide();
        $('[name=lessorsMunicipality]').children("option[class^="+provinceCode + "]").show();
    });


    $('[name=lessorsMunicipality]').on('change', function(){
        $('[name=lessorsBarangay]').removeAttr('disabled');

        var cityCode = this.options[this.selectedIndex].id;
         KTDisplayBarangay(cityCode);
    });


    /*$('[name=sameBusinessAddress]').on('click', function(){
            var bunit = $('[name=businessHouseNo]').val();
            var bname = $('[name=businessBuildingName]').val();
            var bsub = $('[name=businessSubdivision]').val();
            var bbrangay =  $('[name=businessBarangay] option:selected').val();
            var bcity =  $('[name=businessCity] option:selected').val();
            var bprov = $('[name=businessProvince] option:selected').val();
            var bregion = $('[name=businessRegion] option:selected').val();
            if(bbrangay != "" || bcity != "" || bprov != "" || bregion !="" ){
                $('#samedata').val(
                    bunit + " " +
                    bname + " " +
                    bsub + ", " +
                    bbrangay + ", " +
                    bcity + ", " +
                    bprov+ ", " +
                    bregion
                    
                );
            }

            else{
                $('#samedata').val("");
            }
            
    });*/

    // function getSixDigitRandom() {
    //       return ;
    //     }
    //     getSixDigitRandom(); // Output: 407578
    KTDisplayBusinessLine();

})

// Initialization
jQuery(document).ready(function() {
    KTCreatePermit.init();
});
