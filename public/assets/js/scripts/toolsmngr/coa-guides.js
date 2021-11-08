'use strict';
// Class definition

//Adding Class of Nav to become active
menuActive('li-menu-tools', 'li-submenu-tools-guides');

var KTCoaGuides = function() {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    var _loadTable = function() {

        var table = $('#tbl_guides').DataTable({
            processing: true,
            serverSide: true,
            info: false,
            paging: true,
            ajax: {
                method : "POST",
                url    : fetch_guides_url
            },
            columns: [
                {
                    data: null,
                    width: 50,
                    render: function( data, type, row, meta ) {
                        return meta.row + 1;
                    }
                },
                {
                    data: 'AcctCode',
                    width: 120,
                    name: 'AcctCode'
                },
                {
                    data: 'AcctTitle',
                    width: 350,
                    name: 'AcctTitle'
                },
                {   
                    data: null,
                    orderable: false,
                    render: function( data, type, row, meta ) {
                        if(data.SubAcctTitle == null) {
                            return "<span class='text-danger'> No Sub Account </span>";
                        } else {
                            var subAcctTitle = data.SubAcctTitle.split(",");
                            var output = "";
                            $.each(subAcctTitle, function(index, value) {
                                    output += "<span class='label label-dot label-dark mr-2'></span><span>"+ value +"</span><br>";
                            })
                            return output;
                        }
                    }
                },
            ]
        });
    };

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
