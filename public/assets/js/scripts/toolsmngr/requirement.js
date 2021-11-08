'use strict';
// Class definition

//Adding Class of Nav to become active
menuActive('li-menu-tools', 'li-submenu-tools-requirements');

var KTCoaGuides = function() {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    var _loadTable = function() {
    };


    $('.update_requirement').on('click', function(){
        $('#modalEditRequirement').modal('show');
        var id = $('.update_requirement').val();
        $.ajax({
           url: fetch_requirement_row_url,
            type: "post",
            data: {"requirement": id},
            success:function(res) { 
               console.log(res);
            },
            error:function(a,b,c)
            {
                forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
            }
        })
    });

    $('[name=btn-save]').on('click', function(e){
        e.preventDefault();
        var fd = new FormData($("#kt-form")[0]);
        $.ajax({
                url : create_requirement_url,
                data: fd,
                processData: false,
                contentType: false,
                type: "POST",
                beforeSend: function() {
                    _beforeSend();
                },
                xhr: function() {
                    return _xhr();
                },
                complete: function(xhr) {
                    _complete();
                },
                success:function(res)
                {

                    Swal.fire({
                        title: "Are you sure?",
                        text: "You want to save this assessment?",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "Yes, proceed it!",
                        cancelButtonText: "No, cancel!",
                        reverseButtons: true
                    }).then(function(result) {
                        if (result.value) {
                        
                            forSwal("Successfully Saved", "success", "btn-success");
                            $("#kt-form").trigger('reset');

                        } else if (result.dismiss === "cancel") {
                            _disabledForm();
                        }
                    });
                       
                },
                error:function(a,b,c)
                {
                    forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
                }
        });
    })
    return {
        // public functions
        init: function() {
            _loadTable();
        },
    };
}();

jQuery(document).ready(function() {
    KTCoaGuides.init();
});
