"use strict";
// Class definition
// menuActive('li-menu-tools', 'li-submenu-bplo-bussline');
var table1,table2,table3,table4;
var TaxCompID;
var BusslineID;
var MayorsID;

var _commaSeparateNumber = function(val) {
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
}


var ViewComputation = function(id) {
    $.ajax({
        url: view_computation_url,
        type: "post",
        data: {"buss_cat": id},
        success:function(res) { 

            $('#modalViewComputation').modal('show');
            $('.taxtable_id').text(res.data.busscattax_id);
            $('.description').text(res.data.description);
            if (res.computation != "") {
                var table = $("#tblbusscat_computation tbody");
                var output = '';
                table.empty();
              
                $.each(res.computation, function(key, value){
                    var tax = (res.data.busscattax_id == 1007) ? parseFloat(value.taxcompute_rate * 100).toFixed(1) + '%' : _commaSeparateNumber(value.taxcompute_amount);
                    output += `<tr>
                                    <td class="font-weight-bold">
                                       `+ _commaSeparateNumber(value.start_range) +` or more but less than `+ _commaSeparateNumber(value.end_range) +`
                                    </td>
                                    <td class="text-right tax-compute">
                                       `+ tax +`
                                    </td>
                                    <td class="text-center">
                                        <a href="javascript:;" class="btn btn-sm btn-clean mr-2 text-center" onclick=UpdateGrossSales(\'` +value.taxcomp_id + `\')` +`>
                                            <span class="svg-icon svg-icon-md">
                                                  <i class="la la-pencil"></i>
                                            </span>
                                            <span class="navi-text">Edit Details</span>
                                        </a>
                                    </td>
                                 </tr>`
                }); 
                table.append(output);

                if(res.data.busscattax_id == 1001){
                    $('#tblbusscat_computation tbody tr .tax-compute:last').text(`At a rate of fifty-three and three-fourths (53.75%) of one percent (1%) 
                                as amended CRN-015-2019`);
                }
                else if(res.data.busscattax_id == 1003){
                    $('#tblbusscat_computation tbody tr .tax-compute:last').text(` At a rate of fifty-five percent (55%) of one percent (1%)`);
                    
                }
                else if(res.data.busscattax_id == 1009){
                    $('#tblbusscat_computation tbody tr .tax-compute:last').text(` At a rate of fifty-five percent (55%) of one percent (1%) in excess of 2,000,000.00`);
                    
                }
            }
            else{
                $("#tblbusscat_computation tbody").html(`<tr style="background:lightgray !important">
                    <td class="font-weight-bold text-center" colspan="3">
                      No records found
                    </td>
                 </tr>`)
            } 
        },
        error:function(a,b,c)
        {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    })
}

var UpdateGrossSales = function(taxcomp_id){
    TaxCompID = taxcomp_id;
    $('#modalUpdateGrossSales').modal('show');
    $.ajax({
        url: fetch_taxcomp_url,
        type: "post",
        data: {"taxcomp_id": taxcomp_id},
        success:function(res) { 
            $('[name=min_amount]').val(res.start_range)
            $('[name=max_amount]').val(res.end_range)
            $("select[name=tax_yr] option:contains('" + res.year_id + "')").attr('selected', 'selected');
            $('[name=taxamount]').val(res.taxcompute_amount)
            $('[name=taxmode]').val(res.taxcompute_mode)
            $('[name=taxrate]').val(res.taxcompute_rate)
        },
        error:function(a,b,c)
        {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    })
}

var UpdateBusinessline = function(bussline_id){
    BusslineID = bussline_id;
    $('#modalUpdateBusinessline').modal('show');
     $.ajax({
        url: fetch_busslineinfo_url,
        type: "post",
        data: {"bussline_id": bussline_id},
        success:function(res) { 
            $("select[name=busscat_desc] option:contains('" + res.busscat_desc + "')").attr('selected', 'selected')
            $('[name=bussline_desc]').val(res.bussclass_desc)
            $('#taxtable_id').text(res.busstax_id)
        },
        error:function(a,b,c)
        {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    }) 
}

var SetInactive = function(bussline_id){
    BusslineID = bussline_id;

    Swal.fire({
        title: "<b class='text-primary'>CONFIRMATION</b>",
        html: "Are you sure you want to set this businessline to inactive?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#0BB07E",
        confirmButtonText: "Yes, please.",
        cancelButtonText: "No, Cancel.",
        reverseButtons: true,
        customClass: 'swal-wide',
    }).then(function(result) {
        if (result.value) {
            $.ajax({
                url: setinactive_businesline_url,
                type: "post",
                data: {"bussline_id": bussline_id},
                success:function(res) {
                    res = res.trim(); 
                    if( res == "success" ) {
                        forSwal("Businessline Successfully Set Inactive", "success", "btn-success");
                        table2.ajax.reload();
                    }
                },
                error:function(a,b,c)
                {
                    forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                }
            }) 

        }
    });
}


var UpdateMayorsFee = function(mayors_id){
    MayorsID = mayors_id;
    $('#modalUpdateMayorsFee').modal('show');
     $.ajax({
        url: fetch_mayorsfeeinfo_url,
        type: "post",
        data: {"mayors_id": mayors_id},
        success:function(res) { 
           $('.mayors_id').text(res.mayorstax_id);
           $('.bussline_desc').text(res.bussline_desc);
           $('[name=mayors_amount]').val(res.amount);
            switch(res.busssize_id)
            {
                case 1 : 
                    return  $('.busssize_desc').text("Cottage")
                break;

                case 2 : 
                    return $('.busssize_desc').text("Small")
                break;

                case 3 : 
                    return $('.busssize_desc').text("Medium")
                break;

                case 4 : 
                    return $('.busssize_desc').text("Large")
                break;
            }
        },
        error:function(a,b,c)
        {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    })   
}


var KTManageBussLines = function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });


var loadBusinessCategories = function(){
        if( table1 ) { 
            table1.clear();
            table1.destroy(); 
        }

        table1 =$('#tblBussCategories').DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            pageLength: 10,
            language: {                
                infoFiltered: ""
            },
            destroy: true,
            ajax : {
                type: 'post',
                url : fetch_busscategory_url
            },
            columns : [
                { data: 'busscattax_id'},
                { data: 'description'},
                {   
                    data : null,
                    name : 'actions',
                    render : function (data,type,row,meta)
                    {
                       return ` <a href="javascript:;" class="btn btn-sm btn-clean mr-2" align="center" onclick=ViewComputation(\'` +data.bc_id + `\')` +`>
                                        <span class="svg-icon svg-icon-md">
                                              <i class="la la-eye"></i>
                                        </span>
                                        <span class="navi-text">View Computations</span>

                                </a>`
                    }
                }
            ]
       });
    }

    var loadBusinessLines = function(){
        if( table2 ) { 
            table2.clear();
            table2.destroy(); 
        }

        table2 =$('#tblBussLines').DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            pageLength: 10,
            language: {                
                infoFiltered: ""
            },
            destroy: true,
            ajax : {
                type: 'post',
                url : fetch_bussline_url
            },
            columns : [
                { data: 'businessclass_id'},
                {
                    data: null,
                    name: 'actions',
                    render : function (data,type, row, meta)
                    {
                        return data.bussclass_desc +'<br> <span class="font-size-sm text-muted">'+data.busscat_desc+'</span>' 
                    }
                },
                {   
                    data : null,
                    name : 'actions',
                    render : function (data,type,row,meta)
                    {
                       return `
                            <a href="javascript:;" class="btn btn-sm btn-clean mr-2 text-center" onclick=UpdateBusinessline(\'` +data.bl_id + `\')` +`>
                                <span class="svg-icon svg-icon-md">
                                    <i class="la la-pencil"></i>
                                </span>
                                <span class="navi-text">Edit Businessline</span>
                            </a>
                            <a href="javascript:;" class="btn btn-sm btn-clean mr-2 text-center" onclick=SetInactive(\'` +data.bl_id + `\')` +`>
                                <span class="svg-icon svg-icon-md">
                                    <i class="la la-leaf"></i>
                                </span>
                                <span class="navi-text">Set Inactive</span>
                            </a>`
                    }

                }
            ]
       });
    }

    var loadMayorsFee = function(){
        if( table3 ) { 
            table3.clear();
            table3.destroy(); 
        }

        table3 =$('#tblMayorsFee').DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            pageLength: 10,
            language: {                
                infoFiltered: ""
            },
            destroy: true,
            ajax : {
                type: 'post',
                url : fetch_mayorsfee_url
            },
            columns : [
                { data: 'mayorstax_id'},
                { data: 'bussline_desc'},
                 {
                    data : null,
                    name : 'actions',
                    render : function (data,type,row,meta)
                    {
                       switch(data.busssize_id)
                        {
                            case 1 : 
                                return '<span class="label label-inline label-light-success font-weight-bold"> Cottage</span>';
                            break;

                            case 2 : 
                                return '<span class="label label-inline label-light-primary font-weight-bold"> Small </span>';
                            break;

                            case 3 : 
                                return '<span class="label label-inline label-light-info font-weight-bold"> Medium</span>';
                            break;

                            case 4 : 
                                return '<span class="label label-inline label-light-warning font-weight-bold"> Large </span>';
                            break;
                        }
                    }
                },
                {
                    data: null,
                    name: 'actions',
                    render : function (data,type, row, meta)
                    {
                        return _commaSeparateNumber(data.amount); 
                    }
                },

                {   
                    data : null,
                    name : 'actions',
                    render : function (data,type,row,meta)
                    {
                       return `
                                    <a href="javascript:;" class="btn btn-sm btn-clean mr-2 text-center" onclick=UpdateMayorsFee(\'` +data.mayors_id + `\')` +`>
                                        <span class="svg-icon svg-icon-md">
                                            <i class="la la-pencil"></i>
                                        </span>
                                        <span class="navi-text">Edit Details</span>

                                    </a>`
                    }

                }
            ]
       });
    }


    var loadGarbageFee = function(){
        if( table4 ) { 
            table4.clear();
            table4.destroy(); 
        }

        table4 =$('#tblGarbageFee').DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            pageLength: 10,
            language: {                
                infoFiltered: ""
            },
            destroy: true,
            ajax : {
                type: 'post',
                url : garbage_fee_url
            },
            columns : [
                { data: 'mayorstax_id'},
                { data: 'bussline_desc'},
                 {
                    data : null,
                    name : 'actions',
                    render : function (data,type,row,meta)
                    {
                       switch(data.busssize_id)
                        {
                            case 1 : 
                                return '<span class="label label-inline label-light-success font-weight-bold"> Cottage</span>';
                            break;

                            case 2 : 
                                return '<span class="label label-inline label-light-primary font-weight-bold"> Small </span>';
                            break;

                            case 3 : 
                                return '<span class="label label-inline label-light-info font-weight-bold"> Medium</span>';
                            break;

                            case 4 : 
                                return '<span class="label label-inline label-light-warning font-weight-bold"> Large </span>';
                            break;
                        }
                    }
                },
                {
                    data: null,
                    name: 'actions',
                    render : function (data,type, row, meta)
                    {
                        return _commaSeparateNumber(data.amount); 
                    }
                },

                {   
                    data : null,
                    name : 'actions',
                    render : function (data,type,row,meta)
                    {
                       return `
                                    <a href="javascript:;" class="btn btn-sm btn-clean mr-2 text-center" onclick=UpdateMayorsFee(\'` +data.mayors_id + `\')` +`>
                                        <span class="svg-icon svg-icon-md">
                                            <i class="la la-pencil"></i>
                                        </span>
                                        <span class="navi-text">Edit Details</span>

                                    </a>`
                    }

                }
            ]
       });
    }

    $("#btn-save-changes").on('click', function(e){
        Swal.fire({
            title: "<b class='text-primary'>CONFIRMATION</b>",
            html: "Are you sure you want to save changes?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#0BB07E",
            confirmButtonText: "Yes, please.",
            cancelButtonText: "No, Cancel.",
            reverseButtons: true,
            customClass: 'swal-wide',
        }).then(function(result) {
            if (result.value) {
                var fd = new FormData($("#form-update-taxbracket")[0]);
                fd.append('taxcomp_id', TaxCompID);
                $.ajax({
                    url : update_taxbracket_url,
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
                    success:function(res) {
                        res = res.trim();
                        if( res == "success" ) {
                            table1.ajax.reload();
                            table2.ajax.reload();
                            $('#modalUpdateGrossSales').modal('hide');
                            $('#modalViewComputation').modal('hide');

                            forSwal("Successfully Saved", "success", "btn-success");

                        } else {
                            forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
                        }
                    },
                    error:function(a,b,c) {
                        forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
                    }
                });

            }
        });
    });


    $("#btn_save_businesslines").on('click', function(e){
        Swal.fire({
            title: "<b class='text-primary'>CONFIRMATION</b>",
            html: "Are you sure you want to save changes?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#0BB07E",
            confirmButtonText: "Yes, please.",
            cancelButtonText: "No, Cancel.",
            reverseButtons: true,
            customClass: 'swal-wide',
        }).then(function(result) {
            if (result.value) {
                var fd = new FormData($("#form-update-businesslineinfo")[0]);
                fd.append('bussline_id', BusslineID);
                $.ajax({
                    url : update_businesslineinfo_url,
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
                    success:function(res) {
                        res = res.trim();
                        if( res == "success" ) {
                            table1.ajax.reload();
                            table2.ajax.reload();
                            $('#modalUpdateBusinessline').modal('hide');

                            forSwal("Successfully Saved", "success", "btn-success");

                        } else {
                            forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
                        }
                    },
                    error:function(a,b,c) {
                        forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
                    }
                });

            }
        });
    });

    $("#btn_save_newbusinesslines").on('click', function(e){
        Swal.fire({
            title: "<b class='text-primary'>CONFIRMATION</b>",
            html: "Are you sure you want to save changes?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#0BB07E",
            confirmButtonText: "Yes, please.",
            cancelButtonText: "No, Cancel.",
            reverseButtons: true,
            customClass: 'swal-wide',
        }).then(function(result) {
            if (result.value) {
                var fd = new FormData($("#form-newbussline")[0]);
                $.ajax({
                    url : create_businessline_url,
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
                    success:function(res) {
                        res = res.trim();
                        
                        table1.ajax.reload();
                        table2.ajax.reload();
                        $('#modalUpdateBusinessline').modal('hide');

                        forSwal("Successfully Saved", "success", "btn-success");

                    },
                    error:function(a,b,c) {
                        forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
                    }
                });

            }
        });
    });

    $("#btn_save_mayorsfee").on('click', function(e){
        Swal.fire({
            title: "<b class='text-primary'>CONFIRMATION</b>",
            html: "Are you sure you want to save changes?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#0BB07E",
            confirmButtonText: "Yes, please.",
            cancelButtonText: "No, Cancel.",
            reverseButtons: true,
            customClass: 'swal-wide',
        }).then(function(result) {
            if (result.value) {
                var fd = new FormData($("#form-update-mayorsfee")[0]);
                fd.append('mayors_id', MayorsID);
                $.ajax({
                    url : update_mayorsfeeinfo_url,
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
                    success:function(res) {
                        res = res.trim();
                        if( res == "success" ) {
                            table1.ajax.reload();
                            table2.ajax.reload();
                            table3.ajax.reload();
                            $('#modalUpdateMayorsFee').modal('hide');

                            forSwal("Successfully Saved", "success", "btn-success");

                        } else {
                            forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
                        }
                    },
                    error:function(a,b,c) {
                        forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
                    }
                });

            }
        });
    });


    $('[name=sel_busscat]').on('change', function(e){
        var res = $(this).find(":selected").val();
        $('[name=taxtable_id]').val(res);
    });

   
    

    return {
        // public functions
        init: function() {
            // _onLoad();
            loadBusinessCategories();
            loadBusinessLines();
            loadMayorsFee();
            // loadGarbageFee();

        }
    };

}();

// Initialization
jQuery(document).ready(function() {
    KTManageBussLines.init();
});