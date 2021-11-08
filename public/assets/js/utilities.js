"use strict";

// Class definition

//Toggle Active Menu
var menuActive = function (menu, submenu = null, lastmenu = null) {
    $(".menu-item").removeClass('menu-item-active');
    $(".menu-item").removeClass('menu-item-open');
    $("#" + menu).addClass('menu-item-active');
    $("#" + menu).addClass('menu-item-open');
    if(submenu  != null) { 
        $("#" + submenu).addClass('menu-item-active'); 
    }
    if(lastmenu != null) { 
        $("#" + lastmenu).addClass('menu-item-active'); 
    }
}

//Swal
var forSwal = function(message, icon, btn){
    swal.fire({
        text: message,
        icon: icon,
        buttonsStyling: false,
        confirmButtonText: "Ok",
        customClass: {
            confirmButton: "btn font-weight-bold " + btn
        }
    })
}

//BeforeSend Ajax
var _beforeSend = function() {
    $("#loader").show(0);
    //$('.progress-bar').width('0%');
    //$('.percent').html('0%');
}

//Http Request - usually use for uploading a files
var _xhr = function() {
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", function(evt) {
        if (evt.lengthComputable) {
            var percentComplete = ((evt.loaded / evt.total) * 100);
            $(".progress-bar").width(percentComplete + '%');
            $(".progress-bar").html(percentComplete+'%');
        }
    }, false);
    return xhr;
}

//Ajax Complete
var _complete = function() {
    $("#loader").hide(0);
    //$('.progress-bar').width('0%');
    //$('.percent').html('0%');
}

var _loadBtn = function(btn) {
    var button = KTUtil.getById(btn);
    KTUtil.btnWait(button, "spinner spinner-left spinner-darker-success pl-15");
}

var _releaseBtn = function(btn) {
    KTUtil.btnRelease(btn);
}

//Format Number
/*var _commaSeparateNumber = function(val) {
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
}*/

var _updateIsRead = function(id, div) {
    $("#"+div).removeClass('bg-light-secondary');

    $.ajax({
        url : update_notif_is_read_url,
        type: "post",
        data: {"id": id}, 
        dataType: 'json',
        success:function( res ){

        }
    })
}

var _updatePopIn = function(id) {
    $.ajax({
        url : update_notif_is_pop_url,
        type: "post",
        data: {"id": id}, 
        dataType: 'json',
        success:function( res ){

        }
    })
}

var _updateIsOpen = function() { // Auto update in other pages
    $("#notifDot").hide(0);
    $("#notifBtn").removeClass('pulse pulse-white');

    $.ajax({
        url : update_notif_is_open_url,
        type: "post",
        dataType: 'json',
        success:function( res ){

        }
    });
}

Inputmask.extendAliases({
    pesos: {
        prefix: "₱ ",
        groupSeparator: ".",
        alias: "numeric",
        placeholder: "0",
        autoGroup: true,
        digits: 2,
        digitsOptional: false,
        clearMaskOnLostFocus: false
    }
});
$('.peso').inputmask({ alias : "pesos" });


var KTUtilities = function () {

        var isNotifOpen = false, newNotif = false;

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $("#notifBtn").click(function() {
            isNotifOpen = !isNotifOpen;
            if(isNotifOpen) {
                $("#notifDot").hide(0);
                $("#notifBtn").removeClass("pulse pulse-white");

                $.ajax({
                    url : update_notif_is_open_url,
                    type: "post",
                    dataType: 'json',
                    beforeSend: function(){
                        $("#notifSpinner").show(0);
                    },
                    complete: function(){
                        $("#notifSpinner").hide(0);
                    },
                    success:function( res ){
                        if(res[0] == "success") {
                            _displayNotifList(res[1]);
                        }
                    },
                    error: function(a,b,c) {

                    }
                });
            }
        })

        var _displayNotifList = function(data) {
            var el = $("#notifList"), output = "", count = 0;
            el.empty();

            var notifType = {
                'Task'    : { 'class' : 'flaticon-file-2 text-success' },
                'Payment' : { 'class' : 'flaticon2-shopping-cart-1 text-primary' },
            }
            if(data.length > 0)
            {
                $.each(data, function(index, value) { 
                    var is_read = ( value.is_read == 0 ) ? 'bg-light-secondary' : '';
                    var divID   = "notif-" + index;
                    output +='<a id="'+divID+'" type="button" onclick=_updateIsRead('+value.id+',"'+divID+'") class="navi-item mb-2 '+ is_read +'">\
                                <div class="navi-link">\
                                    <div class="navi-icon mr-2">\
                                        <i class="'+notifType[value.notif_type].class+'"></i>\
                                    </div>\
                                    <div class="navi-text">\
                                        <div class="font-weight-bold">'+value.message+'</div>\
                                        <div class="text-muted">'+_computeDate(value.date)+'</div>\
                                    </div>\
                                </div>\
                            </a>';
                    count++;
                });
            }
            else
            {
                output +='<a class="navi-item mt-10">\
                            <div class="navi-link">\
                                <div class="navi-text">\
                                    <div class="font-weight-bolder text-center font-size-h4 text-danger">No new notification available</div>\
                                </div>\
                            </div>\
                        </a>';
            }
            el.append(output);
            $("#notifCount").text(count);
        }

        var _computeDate = function(date_str) {
            if (!date_str) {return;}
            date_str = $.trim(date_str);
            date_str = date_str.replace(/\.\d\d\d+/,""); // remove the milliseconds
            date_str = date_str.replace(/-/,"/").replace(/-/,"/"); //substitute - with /
            date_str = date_str.replace(/T/," ").replace(/Z/," UTC"); //remove T and substitute Z with UTC
            date_str = date_str.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // +08:00 -> +0800
            var parsed_date = new Date(date_str);
            var relative_to = (arguments.length > 1) ? arguments[1] : new Date(); //defines relative to what ..default is now
            var delta = parseInt((relative_to.getTime()-parsed_date)/1000);
            delta=(delta<2)?2:delta;
            var r = '';
            if (delta < 60) {
            r = delta + ' seconds ago';
            } else if(delta < 120) {
            r = 'a minute ago';
            } else if(delta < (45*60)) {
            r = (parseInt(delta / 60, 10)).toString() + ' minutes ago';
            } else if(delta < (2*60*60)) {
            r = 'an hour ago';
            } else if(delta < (24*60*60)) {
            r = '' + (parseInt(delta / 3600, 10)).toString() + ' hours ago';
            } else if(delta < (48*60*60)) {
            r = 'a day ago';
            } else {
            r = (parseInt(delta / 86400, 10)).toString() + ' days ago';
            }
            return r;
        }

        var _fetchUnReadNotif = function() {
            $.ajax({
                url : fetch_uread_notif_url,
                type: "post",
                dataType: 'json',
                success:function( res ){
                    var is_open = true, data = "";
                    $.each(res, function(index, value){
                        if(value.is_open == 0) {
                            is_open = false;
                            return false;
                        }
                    });
                    if(!is_open) {
                        $("#notifDot").show(0);
                        $("#notifBtn").addClass("pulse pulse-white");
                        //$("#notifAudio")[0].play();
                        _popUpNotif(res);
                    } else {
                        $("#notifDot").hide(0);
                        $("#notifBtn").removeClass("pulse pulse-white");
                    }
                }
            })
        }

        var _popUpNotif = function(res) {
            $.each(res, function(index, value){
                if(value.is_pop_in == 0)
                {
                    /*var content = {};
                    content.title = "New notification";
                    content.icon  = "icon flaticon2-bell-4";
                    content.message = value.message;
                    $.notify(content, {
                        type: "dark",
                        allow_dismiss: true,
                        newest_on_top: false,
                        mouse_over:  false,
                        showProgressbar:  false,
                        spacing: 10,
                        timer: 3000,
                        placement: {
                            from: "bottom",
                            align: "left"
                        },
                        offset: {
                            x: 30,
                            y: 30
                        },
                        delay: 1000,
                        z_index: 10000,
                        animate: {
                            enter: 'animate__animated animate__bounceInLeft',
                            exit: 'animate__animated animate__zoomOut'
                        }
                    });*/
                    _updatePopIn(value.id);
                }
            });
        }

        var _sessionTimeout = function () {
            $.sessionTimeout({
                keepAlive: false,
                redirUrl: login_url,
                warnAfter: 7200000,
                redirAfter: 86400000,
                onWarn: function () {
                    $("#sessionModal").modal({
                        backdrop: 'static',
                        keyboard: false, 
                        show: true
                    });
                }
            });
        }

    return {
        // public functions
        init: function () {
            $("#notifSpinner").hide(0);
            $("#notifDot").hide(0);
            $("#notifBtn").removeClass("pulse pulse-white");

            _fetchUnReadNotif();
            
            // setInterval(function(){ 
            //     _fetchUnReadNotif();
            // }, 5000);

            _sessionTimeout();
        }
    };

}();

jQuery(document).ready(function () {
    KTUtilities.init();
});
