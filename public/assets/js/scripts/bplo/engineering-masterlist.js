"use strict";
// Class definition
menuActive('li-menu-bplo', 'li-submenu-bplo-engr');


var engineering_id;

var KTEngineering = function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });


    var _onLoad = function() {
    };

    var loadMasterlistTable = function() {
       
        $('#kt_datatable_eng_masterlist').DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            language: {                
                infoFiltered: ""
            },
            ajax : {
                method: 'post',
                url : fetch_engineering_masterlist_url
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
                                        '                <a class="navi-link" onclick=displayHistory(\'' +data.business_id + '\')>' +
                                        '                    <span class="navi-icon">' +
                                        '                        <i class="la la-eye"></i>' +
                                        '                    </span>' +
                                        '                    <span class="navi-text">Assessment History</span>' +
                                        '                </a>' +
                                        '            </li>' +
                                        '            <li class="navi-item">' +
                                        '                <a href="#" class="navi-link" id="edit-">' +
                                        '                    <span class="navi-icon"><i class="la la-edit"></i></span>' +
                                        '                    <span class="navi-text">Reassessment</span>' +
                                        '                </a>' +
                                        '            </li>' +
                                        '        </ul>' +
                                        '    </div>' +
                                        '</div>'
                    
                    }


                }
            ]
       });
    }

    return {
        // public functions
        init: function() {
            _onLoad();
            loadMasterlistTable();
        }
    };

}();


function displayHistory(history){ 
        $('#modalAssessmentHistory').modal('show');
        var business_name = null; 
        var business_id = null; 
        var business_address = null; 
        var transaction = null;
        var assessment_date = null;

        $('#kt-table').DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            language: {                
                infoFiltered: ""
            },
            destroy: true,
            ajax : {
                type: 'post',
                url : fetch_engineering_assessment_history_url,
                data: {"business_id": history}
            },
            columns : [
                { data : 'transaction' },
                { data : 'assess_date' },
                { data : 'total_amount' },
                {   
                    data : null,
                    name : 'actions',
                    render : function (data,type,row,meta)
                    {

                        business_name = data.business_name;
                        business_id = data.business_id;
                        business_address = data.business_address;
                        transaction = data.transaction;
                        assessment_date = data.assess_date;

                        $.each(data, function(index, value){
                            $('#business_name').text(business_name);
                            $('#business_id').text(business_id);
                            $('#business_address').text(business_address);
                            $('.transaction_type').text(transaction + ' BUSINESS PERMIT');
                            $('.business_name').text(business_name);
                            $('.assessed_date').text(assessment_date);
                        });

                        
                      
                           return `
                                <a href="#" class="btn btn-light-success btn-sm" onclick=getAssessmentSummary(\'` +data.assessment_id + `\')>
                                    View Details
                                </a>

                            
                           `
                    }

                }
            ]
       });
}

$('#modalAssessmentHistory').on('hidden.bs.modal', function(e){
    $('#kt-table tbody').html("");
});

function getAssessmentSummary(summary){
    $('#modalAssessmentSummary').modal('show');
    $('input[type=number]').attr('disabled','true');
    $.ajax({
       url: fetch_engineering_assessment_summary_url,
        type: "post",
        data: {"engineering_id": summary},
        success:function(res) { 
            $.each(res, function(index, value){
                $('#InspectionFee').val(value.buildinginspection_fee);
                $('#MechanicalFee').val(value.mechanical);
                $('#ElectricalFee').val(value.electrical);
                $('#PlumbingFee').val(value.plumbing);
                $('#ElectronicsFee').val(value.electronics);
                $('#AdsFee').val(value.signsandbillboards);
                $('#EngineeringFee').val(value.engineering_fee);
                $('#totalAmountFee').val(value.total_amount);
            });
        },
        error:function(a,b,c)
        {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    })
}

function editEngineeringAssessment(id){
    //modal will display
    //fetch data from database and display to each elements in modal for editing
    $('#modalUpdateEngineeringAssessment').modal('show');
    $('input[type=number]').removeAttr('disabled');
    $.ajax({
       url: fetch_engineering_assessment_summary_url,
        type: "post",
        data: {"engineering_id": id},
        success:function(res) { 
            engineering_id = id;
            $.each(res, function(index, value){
                $('[name=EditInspectionFee]').val(value.buildinginspection_fee);
                $('[name=EditMechanicalFee]').val(value.mechanical);
                $('[name=EditElectricalFee]').val(value.electrical);
                $('[name=EditPlumbingFee]').val(value.plumbing);
                $('[name=EditElectronicsFee]').val(value.electronics);
                $('[name=EditAdsFee]').val(value.signsandbillboards);
                $('[name=EditEngineeringFee]').val(value.engineering_fee);
                $('[name=EdittotalAmountFee]').val(value.total_amount);
            });
          
        },
        error:function(a,b,c)
        {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    })
    $('[name=totalAmountFee]').attr('disabled', 'true');
}

function updateInput(){
    var inspection  = parseInt($('[name=EditInspectionFee]').val());
    var mechanical  = parseInt($('[name=EditMechanicalFee]').val());
    var electrical  = parseInt($('[name=EditElectricalFee]').val());
    var plumbing    = parseInt($('[name=EditPlumbingFee]').val());
    var electronics = parseInt($('[name=EditElectronicsFee]').val());
    var adsSigns    = parseInt($('[name=EditAdsFee]').val());
    var engineering = parseInt($('[name=EditEngineeringFee]').val());

    var totalAmountFee  = inspection + mechanical + electrical + plumbing + electronics + adsSigns + engineering;
    $('[name=EdittotalAmountFee]').val(totalAmountFee);

}

// $("#btn_update").on('click', function(e) {
//     e.preventDefault();
//     Swal.fire({
//         title: "Are you sure?",
//         text: "You want to save changes to this assessment?!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Yes, please!",
//         cancelButtonText: "No, cancel!",
//         customClass: {
//            confirmButton: "btn btn-success mt-0"
//         },
//         reverseButtons: true
//     }).then(function(result) {
//         if (result.value) {
//             var fd = new FormData($("#form-udpate-assessment")[0]);
//             fd.append('engineering_id', engineering_id);
//             $.ajax({
//                 url : update_engineering_assessment_url,
//                 data: fd,
//                 processData: false,
//                 contentType: false,
//                 type: "POST",
//                 success: function(res)
//                 {
                    
//                     if(res == 'success') {
//                         Swal.fire("Great!", "Your changes have been saved successfully!", "success");
//                         $("#modalUpdateEngineeringAssessment").modal('hide');
//                         $('#kt-table').DataTable().ajax.reload();
//                     }
//                     else {
//                         Swal.fire("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
//                     }
//                 },
//                 error:function(a,b,c)
//                 {
//                     //Swal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
//                 }
//             });
//         }
//     });
// });







// Initialization
jQuery(document).ready(function() {
    KTEngineering.init();

});