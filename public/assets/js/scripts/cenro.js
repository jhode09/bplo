"use strict";
// Class definition
menuActive('li-menu-bplo', 'li-submenu-bplo-cenro');

var KTCenro = function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });


    var _onLoad = function() {
        $('#kt_datatable').DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            language: {                
                infoFiltered: ""
            },
            ajax : {
                url : fetch_business_masterlist_url
            },
            columns : [
                { data : 'business_id' },
                { data : 'business_name' },
                { data : 'barangay' },
                {
                    data : null,
                    name : 'actions',
                    render : function (data,type,row,meta)
                    {
                       switch(data.status)
                        {
                            case 1 : 
                                return '<span class="label label-inline label-light-success font-weight-bold"> CLOSING </span>'
                            break;

                            case 2 : 
                                return '<span class="label label-inline label-light-primary font-weight-bold"> REASSESSMENT </span>'
                            break;

                            case 3 : 
                                return '<span class="label label-inline label-light-info font-weight-bold"> NEW </span>'
                            break;

                            case 4 : 
                                return '<span class="label label-inline label-light-warning font-weight-bold"> RENEW</span>'
                            break;

                            case 5 : 
                                return '<span class="label label-inline label-light-danger font-weight-bold"> SPECIAL PERMIT </span>'
                            break;


                        }

                      
                    }
                },

                {
                    data : null,
                    name : 'actions',
                    render : function (data,type,row,meta)
                    {
                        return '<span style="overflow: visible; position: relative; width: 125px;"> ' +
                                        '<div class="dropdown dropdown-inline" data-toggle="tooltip" data-title="Settings">' +
                                        '    <a href="javascript:;" class="btn btn-sm btn-clean btn-icon mr-2" data-toggle="dropdown">    ' +
                                        '        <span class="svg-icon svg-icon-md">' +
                                        '            <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">' +
                                        '                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
                                        '                    <rect x="0" y="0" width="24" height="24"></rect>' +
                                        '                    <path d="M5,8.6862915 L5,5 L8.6862915,5 L11.5857864,2.10050506 L14.4852814,5 L19,5 L19,9.51471863 L21.4852814,12 L19,14.4852814 L19,19 L14.4852814,19 L11.5857864,21.8994949 L8.6862915,19 L5,19 L5,15.3137085 L1.6862915,12 L5,8.6862915 Z M12,15 C13.6568542,15 15,13.6568542 15,12 C15,10.3431458 13.6568542,9 12,9 C10.3431458,9 9,10.3431458 9,12 C9,13.6568542 10.3431458,15 12,15 Z" fill="#000000"></path>'+
                                        '                </g>' +
                                        '            </svg>' +
                                        '        </span>' +
                                        '    </a>' +
                                        '    <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">' +
                                        '        <ul class="navi flex-column navi-hover py-2">' +
                                        '            <li class="navi-header font-weight-bolder text-uppercase font-size-xs text-primary pb-2">Choose an action:' +
                                        '            </li>' +
                                        '            <li class="navi-item">' +
                                        '                <a class="navi-link"  onclick=view_details(\'' +data.assessment_id + '\')>' +
                                        '                    <span class="navi-icon">' +
                                        '                        <i class="la la-eye"></i>' +
                                        '                    </span>' +
                                        '                    <span class="navi-text">View Details</span>' +
                                        '                </a>' +
                                        '            </li>' +
                                        '            <li class="navi-item">' +
                                        '                <a class="navi-link assessment" onclick=confirm_assess(\'' +data.assessment_id + '\')>' +
                                        '                    <span class="navi-icon"><i class="la la-check-circle"></i></span>' +
                                        '                    <span class="navi-text">Assessment</span>' +
                                        '                </a>' +
                                        '            </li>'
                                        '        </ul>' +
                                        '    </div>' +
                                        '</div>'
                    }
                }
            ]
       });
    

    // $('table tfoot td').eq(index).text('Total: ' + total);

        $('select[name="selNatureOfBusiness"]').on('change', function(){
            var id = $(this).val();
             $.ajax({
               url: fetch_nature_of_business_amount_url,
                type: "post",
                data: {"fee_id": id},

                success:function(res) { 
                    console.log(res);
                    $.each(res, function(index, value){
                        $('#natureOfBusinessAmount').val(parseFloat(value.amount).toFixed(2));
                        // $('#subtotal-inspection').val(parseFloat(value.amount).toFixed(2));
                        // _computeTotalSanitary();

                    });
                },
                error:function(a,b,c)
                {
                    forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                }
            })
        })
    };
    $('#table thead th').each(function(i) {
        calculateColumn(i);
    });
     function calculateColumn(index) {
        var total = 0;
        $('#table tbody tr').each(function() {
            var value = parseInt($('td', this).eq(index).text());
            if (!isNaN(value)) {
                total += value;
            }
        });
        $('#table tfoot th').eq(index).text(total);

    }
    return {
        // public functions
        init: function() {
            _onLoad();
            calculateColumn();
        }
    };

}();

// Initialization
jQuery(document).ready(function() {
    KTCenro.init();
});