"use strict";
// Class definition
menuActive('li-menu-bplo', 'li-submenu-permitapp', 'li-lastmenu-permitapp-masterlist');
var GenID;
var ReqID;
var BussID;
var ReqDesc;

var UploadFile = function(desc, req_id)
{
    ReqID = req_id;
    ReqDesc = decodeURIComponent(desc);
    $("#fileLabel").text(decodeURIComponent(desc));
    $("#uploadFileModal").modal('show');
}

var CheckRequirements = function( id, app_type, buss_type, gen_id ) 
{
    GenID  = gen_id;
    BussID = id;
    $.ajax({
        url : check_req_url,
        type: 'post',
        data: { 
            id:id, 
            app_type:app_type, 
            buss_type:buss_type 
        },
        beforeSend: function() {
            _beforeSend();
        },
        complete: function() {
            _complete();
        },
        success:function(res) {
            console.log(res);
            var r = "";
            var el = $("#reqListDiv");
            el.empty();
            /*r += '<ul class="list-unstyled font-size-sm"><li><ul class="navi">';
            $.each(res[0], function(index1, res1){
                var isChecked = "";
                var isDisplay = true;
                $.each(res[1], function(index2, res2) {
                    if(res1.id == res2.tblbplorequirement_id) {
                        isChecked = "checked";
                        return false;
                    }
                });
                if(buss_type == 1 || buss_type == 2 || buss_type == 4){
                    if(res1.id == 1 || res1.id == 3) {
                        isDisplay = false;
                    }
                }
                else if(buss_type == 3) {
                    if(res1.id == 1 || res1.id == 2) {
                        isDisplay = false;
                    }
                }
                else if(buss_type == 5) {
                    if(res1.id == 2 || res1.id == 3) {
                        isDisplay = false;
                    }
                }
                if(isDisplay) {
                    var inputFile = (isChecked == "") ? '<div class="col-lg-2"><a type="button" class="btn btn-light-success" onclick=UploadFile(\'' +encodeURIComponent(res1.description)+ '\',\'' +res1.id+ '\')>Upload a File</a></div>' : "";
                    r += '<li class="navi-item">\
                                <ul class="navi mt-1">\
                                    <li>\
                                        <div class="form-group row mb-0">\
                                            <div class="col-lg-7 offset-2">\
                                                <label class="checkbox checkbox-md no-point">\
                                                    <input type="checkbox" '+isChecked+' disabled/>\
                                                    <span></span>\
                                                    <label class="mt-1 ml-2">'+res1.description+'</label>\
                                                </label>\
                                            </div>\
                                            '+inputFile+'\
                                        </div>\
                                    </li>\
                                </ul>\
                            </li>';
                }

            });
            r += '</ul></li></ul>';
            el.append(r);*/
            r += '<table class="table table-lg table-bordered">';
            $.each(res[0], function(index1, res1){
                var isChecked = "";
                var isDisplay = true;
                $.each(res[1], function(index2, res2) {
                    if(res1.id == res2.tblbplorequirement_id) {
                        isChecked = "checked";
                        return false;
                    }
                });
                if(buss_type == 1 || buss_type == 2 || buss_type == 4){
                    if(res1.id == 1 || res1.id == 3) {
                        isDisplay = false;
                    }
                }
                else if(buss_type == 3) {
                    if(res1.id == 1 || res1.id == 2) {
                        isDisplay = false;
                    }
                }
                else if(buss_type == 5) {
                    if(res1.id == 2 || res1.id == 3) {
                        isDisplay = false;
                    }
                }
                if(isDisplay) {
                    //var inputFile = (isChecked == "") ? '<a type="button" class="btn btn-light-success btn-sm" onclick=UploadFile(\'' +encodeURIComponent(res1.description)+ '\',\'' +res1.id+ '\')>Upload a File</a>' : "---";
                    var inputFile = '<a type="button" class="btn btn-light-success btn-sm" onclick=UploadFile(\'' +encodeURIComponent(res1.description)+ '\',\'' +res1.id+ '\')>Upload a File</a>';
                    r += '<tr class="p-0 m-0">';
                    r += '<td width="70%">\
                            <label class="checkbox checkbox-md no-point">\
                                <input type="checkbox" '+isChecked+' disabled/>\
                                <span></span>\
                                <label class="mt-1 ml-2">'+res1.description+'</label>\
                            </label>\
                        </td>';
                    r += '<td class="text-center">' + inputFile + '</td>';
                    r += '</tr>';
                    /*r += '<div class="form-group row mb-0">\
                            <div class="col-lg-7 offset-2">\
                                <label class="checkbox checkbox-md no-point">\
                                    <input type="checkbox" '+isChecked+' disabled/>\
                                    <span></span>\
                                    <label class="mt-1 ml-2">'+res1.description+'</label>\
                                </label>\
                            </div>\
                            '+inputFile+'\
                        </div>';*/
                }
            });
            r += '</table>';
            el.append(r);
            $("#chkReqModal").modal('show');
        },
        error:function(a,b,c){

        }
    });
}

var ViewDetails = function(application_id) 
{
    window.open('/bplo/business_details/'+application_id);
    //window.location.href = '/bplo/business_details/'+application_id;
}


var PrintApp = function(application_id) 
{
    window.open('/bplo/print-application/' + application_id);
}



var KTBusinessMasterlist = function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });


    var _onLoad = function() {

    };

    $("#btn_upload").click(function(){
        var fd = new FormData($("#form_upload_file")[0]);
        fd.append('genID',  GenID);
        fd.append('bussID', BussID);
        fd.append('reqID',  ReqID);
        $.ajax({
            url : upload_singlefile_url,
            type: "post",
            data: fd,
            processData: false,
            contentType: false,
            beforeSend: function() {
                _beforeSend();
            },
            complete: function() {
                _complete();
            },
            success:function(res) {
                res = res.trim();
                if(res == "success") {
                    $("#uploadFileModal").modal('hide');
                    $("#chkReqModal").modal('hide');
                    Swal.fire({
                        html: "File has been upload for <br><b>" + ReqDesc +"</b>",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn font-weight-bold btn-light-success"
                        }
                    });
                    GenID   = "";
                    BussID  = "";
                    ReqID   = "";
                    ReqDesc = "";
                }
            },
            error:function(a,b,c){

            }
        })
    });

    var loadTable = function() {
       $('#kt_datatable').DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            language: {                
                infoFiltered: ""
            },
            ajax : {
                method : "POST",
                url    : fetch_app_masterlist_url
            },
            columns : [
                { data : 'BussID' },
                { data : 'BussName' },
                { data : 'Brgy' },
                { data : 'CreatedAt' },
                {
                    data : null,
                    name : 'actions',
                    render : function (data,type,row,meta)
                    {
                        switch(data.Status)
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
                    orderable: false,
                    render : function (data,type,row,meta)
                    {
                        return  '<div class="dropdown dropdown-inline">\
                                    <a href="javascript:;" class="btn btn-sm btn-clean btn-icon mr-2" data-toggle="dropdown">\
                                        <span class="svg-icon svg-icon-md">\
                                            <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
                                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
                                                    <rect x="0" y="0" width="24" height="24"></rect>\
                                                    <path d="M5,8.6862915 L5,5 L8.6862915,5 L11.5857864,2.10050506 L14.4852814,5 L19,5 L19,9.51471863 L21.4852814,12 L19,14.4852814 L19,19 L14.4852814,19 L11.5857864,21.8994949 L8.6862915,19 L5,19 L5,15.3137085 L1.6862915,12 L5,8.6862915 Z M12,15 C13.6568542,15 15,13.6568542 15,12 C15,10.3431458 13.6568542,9 12,9 C10.3431458,9 9,10.3431458 9,12 C9,13.6568542 10.3431458,15 12,15 Z" fill="#000000"></path>\
                                                </g>\
                                            </svg>\
                                        </span>\
                                    </a>\
                                    <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">\
                                        <ul class="navi flex-column navi-hover py-2">\
                                            <li class="navi-item">\
                                                <a type="button" class="navi-link" onclick=PrintApp(\'' +data.ID+ '\')>\
                                                    <span class="navi-icon">\
                                                        <i class="la la-print"></i>\
                                                    </span>\
                                                    <span class="navi-text">Print Application</span>\
                                                </a>\
                                            </li>\
                                            <li class="navi-item">\
                                                <a type="button" class="navi-link" onclick=ViewDetails(\'' +data.ID+ '\')>\
                                                    <span class="navi-icon">\
                                                        <i class="la la-eye"></i>\
                                                    </span>\
                                                    <span class="navi-text">View Details</span>\
                                                </a>\
                                            </li>\
                                           <li class="navi-item">\
                                                <a type="button" class="navi-link" onclick=CheckRequirements(\'' +data.ID+ '\',\'' +data.Status+ '\',\'' +data.BussType+ '\',\'' +data.BussID+ '\')>\
                                                    <span class="navi-icon">\
                                                       <i class="la la-check-circle"></i>\
                                                    </span>\
                                                   <span class="navi-text">Check Requirements</span>\
                                                </a>\
                                            </li>\
                                           <!--<li class="navi-item">\
                                                <a type="button" class="navi-link ">\
                                                    <span class="navi-icon">\
                                                       <i class="la la-edit"></i>\
                                                </span>\
                                                    <span class="navi-text">Edit Details</span>\
                                                </a>\
                                            </li>\
                                            <li class="navi-item">\
                                                <a type="button" class="navi-link" >\
                                                    <span class="navi-icon"><i class="la la-leaf"></i></span>\
                                                    <span class="navi-text">Inactive</span>\
                                                </a>\
                                            </li>-->\
                                        </ul>\
                                    </div>\
                                </div>';
                    }
                }
            ]
       });
    }

    return {
        // public functions
        init: function() {
            _onLoad();
            loadTable();
        }
    };

}();


// Initialization
jQuery(document).ready(function() {
    KTBusinessMasterlist.init();

});