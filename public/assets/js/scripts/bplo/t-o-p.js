"use strict";
// Class definition
menuActive('li-menu-bplo', 'li-submenu-bplo-top');

var KTTOP = function () {

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

// Initialization
jQuery(document).ready(function() {
    KTTOP.init();
});