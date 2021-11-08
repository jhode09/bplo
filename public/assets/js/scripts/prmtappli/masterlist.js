"use strict";
// Class definition
menuActive('li-menu-bplo', 'li-submenu-permitapp', 'li-lastmenu-permitapp-masterlist');


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
       url: fetch_business_url,
        type: "post",
        data: {"code": id},
        success:function(res) { 
            // var select = $('select[name="ownersBarangay"]');
            // var option = "";
            // console.log(res);
            // $.each(res, function(index, value){
            //     option += `<option
            //          class="`+ value.city_municipality_code+`
            //          value="`+ value.barangay_description+`">
            //          `+value.barangay_description+`
            //     </option>`;
            // });

            // select.empty();
            // select.append(option);

        },
        error:function(a,b,c)
        {
            // forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    })
}


// Initialization
jQuery(document).ready(function() {
    KTCreatePermit.init();
});
