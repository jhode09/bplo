'use strict';
// Class definition

var menuLevel, menuID;

//Adding Class of Nav to become active
menuActive('li-menu-tools', 'li-submenu-tools-menu-settings');

var KTCoaGuides = function() {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    var _showDiv = function(showDiv, tab) {
        var divs = ['#divMenuMgt', '#divChangeAssign'];
        for (var i = 0; i < divs.length; i++) {
            if(divs[i] != showDiv) {
                $(divs[i]).hide(0)
            }
        }
        $(showDiv).show(0);
        $(".dropdown-item").removeClass('active');
        $(tab).addClass('active');
    }

    $("#menuMgtNav").click(function(){
        _showDiv("#divMenuMgt", "#menuMgtNav");
    });


    $('#menuTreeCreate').jstree({
        "core": {
            "themes": {
                "responsive": false,
                "icons": false
            }
        },
        "plugins": ["types"]
    });

    $('#menuTreeUpdate').jstree({
        "core": {
            "themes": {
                "responsive": false,
                "icons": false
            }
        },
        "plugins": ["types"]
    });

    $('#menuTreeUpdate').on('select_node.jstree', function(e, data) {

       _selectMenu(data.selected[0])
    });



    //Update
    var _resetFormUpdate = function() {
        $(".alert").hide(0);
        $("#spanLevel").text("--");
        $(".divMenuDesc").hide(0);
        $(".divMenuIcon").hide(0);
        $(".divMenuLink").hide(0);
        $("#statusNote").hide(0);
        $("#form-menu-update")[0].reset();
        $("select[name='menuStatus']").attr('disabled', true).val('').selectpicker('refresh');
        $("#btn_close, #btn_submit, #btn_update").prop('disabled', true);
    };

    var _selectMenu = function(id) {
        $.ajax({
            url : fetch_menudetails_url,
            type: "post",
            data: {id : id},
            beforeSend:function(){
                _beforeSend();
            }, 
            complete: function(){
                _complete();
            },
            success:function(res) {
                if( res != "not_found" ) {
                    $("#btn_close, #btn_submit, #btn_update").prop('disabled', false);
                    $("#spanLevel").text(id.split("_")[0][1]);
                    $(".divMenuDesc").hide(0);
                    $(".divMenuIcon").hide(0);
                    $(".divMenuLink").hide(0);
                    if(res.MenuDesc) { $(".divMenuDesc").show(0); }
                    if(res.MenuIcon) { $(".divMenuIcon").show(0); }
                    if(res.MenuLink) { $(".divMenuLink").show(0); }
                    $("select[name='menuStatus']").attr('disabled', false).val(res.MenuStatus).selectpicker('refresh');
                    $("input[name='menuName']").val(res.MenuName);
                    $("input[name='menuLIID']").val(res.MenuLIID);
                    $("input[name='menuLink']").val(res.MenuLink);
                    $("input[name='menuDesc']").val(res.MenuDesc);
                    $("input[name='menuIcon']").val(res.MenuIcon);
                    menuID = res.MenuID;
                    menuLevel = $("#spanLevel").text();
                    if( menuLevel < 3 ) { $("#statusNote").show(0); } else { $("#statusNote").hide(0); }
                } else {
                    forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                    _resetFormUpdate();
                }
            }, 
            error: function(a,b,c) {
                forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
            }
        })
    };

    $("#btn_update").on('click', function() {
        var status = true;
        if($("input[name='menuName']").val() == "" || 
            $("input[name='menuLIID']").val() == "" || 
            $("select[name='menuStatus']").val() == "" || 
            $("select[name='menuStatus']").val() < 0 ||
            $("select[name='menuStatus']").val() > 1
        ) { status = false; }

        if(status) {
            $("#loginModal").modal('show');
            $(".alert").hide(0);
            $("#password").val('').focus();
        } else {
            forSwal("Sorry, looks like there are some errors detected, please try again.", "error", "btn-danger");
        }
    });

    $("#password").on('keypress',function(e) {
        if(e.which == 13) {
            if($(this).val() != "") {
                $("#btn_submit").click();
            }
        }
    });

    $("#btn_submit").click(function(){
        if($("#password").val() != "") {
            var fd = new FormData($("#form-menu-update")[0]);
            fd.append("password", $("#password").val());
            fd.append("menuLevel", menuLevel);
            fd.append("menuID", menuID);
            $.ajax({
                url : update_menu_url,
                data: fd,
                processData: false,
                contentType: false,
                type: "post",
                beforeSend:function() {
                    $("#btn_close, #btn_submit").prop('disabled', true);
                    $("#btn_submit").addClass('spinner spinner-white spinner-right');
                },
                complete: function(){
                    $("#btn_submit").removeClass('spinner spinner-white spinner-right');
                },
                success:function(res) {
                    if(res == "success") {
                        location.reload();
                    } else if( res == "failed_pass") {
                        $("#btn_close, #btn_submit").prop('disabled', false);
                        $(".alert").show(0);
                    } else {
                        $("#btn_close, #btn_submit").prop('disabled', false);
                        forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                    }
                },
                error: function(a,b,c) {
                    forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                }
            });
        } else {
            $("#password").focus();
        }
    });

    $(".close").click(function(){

        $(".alert").fadeOut();
    });

    $("#btn_resetUpdate").click(function(){

        _resetFormUpdate();
    });


    return {
        // public functions
        init: function() {
            $(".divMenuIcon").hide(0);
            $(".divMenuDesc").hide(0);
            $(".divMenuLink").hide(0);
            $("#statusNote").hide(0);
            $(".alert").hide(0);
            $("#btn_update").prop("disabled", true);
        },
    };
}();

jQuery(document).ready(function() {
    KTCoaGuides.init();
});
