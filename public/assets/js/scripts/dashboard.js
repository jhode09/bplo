"use strict";
// Class definition
var KTDashboard = function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });


    var _onLoad = function() {
    };


    return {
        // public functions
        init: function() {
            _onLoad();
          
        }
    };

}();


    
$('#btn-generate-report').on('click', function(){
    var year = $('#datepicker').val();
    function generateReport(year){
        $.ajax({
           url: count_annual_new_permit_per_barangay_url,
            type: "post",
            data: {"year": year},
            success:function(res) { 
                console.log("Im Active")

            },
            error:function(a,b,c)
            {
                forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
            }
        })
    }
})


// Initialization
jQuery(document).ready(function() {
    KTDashboard.init();
});