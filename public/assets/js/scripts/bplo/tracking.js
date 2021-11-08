"use strict";
// Class definition
menuActive('li-menu-bplo', 'li-submenu-bplo-tracking');

var ViewDetails = function(id) {
    $.ajax({
        url : track_process_details_url,
        type: "post",
        data: {id: id},
        /*beforeSend: function(){
            _beforeSend();
        },
        complete: function(){
            _complete();
        },*/
        success: function(res) {
            if (typeof res == "string") {
                res = res.trim();
                if (res == "not_found") {
                    forSwal("Business ID does not exists in our record.", "error", "btn-danger");
                } else {
                    forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                }
            }
            else {

                var status = {
                    0: {'title': 'On Going', 'class': 'label-light-warning'},
                    1: {'title': 'Done', 'class': 'label-light-success'},
                };
                var doneDate = ( res.IsDone == 1 ) ? res.UpdatedAt : "---"; 

                $("#divRouteStatus").empty();
                $("#divCurrentStep").empty();
                $("#spanBussID").text(res.BussID);
                $("#spanBussName").text(res.BussName);
                $("#spanBussAddr").text(res.BussAddr);
                $("#divRouteStatus").append('<span class="label ' + status[res.IsDone].class + ' label-inline font-weight-bold label-lg">' + status[res.IsDone].title + '</span>');
                $("#divCurrentStep").append('<span class="label label-light-primary label-inline font-weight-bold label-lg">' + res.RouteDesc + '</span>');
                $("#spanDateForwarded").text(res.CreatedAt);
                $("#spanDateDone").text(doneDate);
                $("#detailsModal").modal('show');
            }
        },
        error: function(a,b,c) {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    })
}

var KTTracking = function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $('#genID').keypress(function(e){
        if(e.which == 13){//Enter key pressed
            $('#btnSearch').click();//Trigger search button click event
        }
    });


    $("#btnSearch").click(function(){
        $.ajax({
            url : track_business_process_url,
            type: "post",
            data: {genID: $("#genID").val()},
            beforeSend: function(){
                _beforeSend();
            },
            complete: function(){
                _complete();
            },
            success: function(res) {
                var el = $("#divHasResult");
                el.empty();
                if (typeof res == "string") {
                    res = res.trim();
                    if (res == "not_found") {
                        _toggleDivResult(true);
                        forSwal("Business ID does not exists in our record.", "error", "btn-danger");
                    } else {
                        forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                    }
                }
                else {
                    var op = "";
                    op += '<div class="form-group row">';
                    op += '<div class="col-lg-8 offset-4 mt-10">';
                    op += '<div class="timeline timeline-6 mt-3">';
                    $.each(res, function(index, value){
                        var lbl_decor = (value.status == 1) ? 'text-success' : 'text-warning';
                        var date      = (value.status == 1) ? value.doneAt : value.forwardedAt;
                        op += `<div class="timeline-item align-items-start">
                                    <div class="timeline-label text-muted font-size-sm">
                                        <span>`+date+`</span>
                                    </div>
                                    <div class="timeline-badge ">
                                        <i class="fa fa-genderless `+lbl_decor+` icon-xl"></i>
                                    </div>
                                    <div class="timeline-content d-flex ml-4">
                                        <a type="button" onclick=ViewDetails(`+value.id+`)>
                                            <span class="font-weight-bolder text-dark-75 pl-3 font-size-lg">`+value.message+`</span>
                                        </a>
                                    </div>
                            </div>`;
                    });
                    op += '</div>';
                    op += '</div>';
                    op += '</div>';
                    el.append(op);
                    _toggleDivResult(false);
                }
            },
            error: function(a,b,c) {
                forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
            }
        })
    })

    var _onLoad = function() {
    };

    var _toggleDivResult = function(bool) {
        $("#divHasResult").prop('hidden', bool);
        $("#divNoResult").prop('hidden', !bool);
    }

    return {
        // public functions
        init: function() {
            _onLoad();
        }
    };

}();

// Initialization
jQuery(document).ready(function() {
    KTTracking.init();
});