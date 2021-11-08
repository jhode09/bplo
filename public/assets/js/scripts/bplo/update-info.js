"use strict";
// Class definition
menuActive('li-menu-bplo', 'li-submenu-bplo-update-info');

var table;
var boardMembers = new Array();
var bussLines    = new Array();
var currentLines = new Array();
var countBoard   = 0;
var hasFound     = false;
var bussID, bussLineDesc, bussClassID;
var GenID, LineID;

var toggleNav = function(nav) {
    $(".navi-link").removeClass('active');
    $(nav).addClass('active');
}

var KTDisplayBarangay = function(id) {
    $.ajax({
       url: fetch_barangay_url,
        type: "post",
        data: {"code": id},
        success:function(res) {
            var select = $('select[name="ownersBarangay"]');
            var option = "";
            $.each(res, function(index, value){
                option += `<option class="`+ value.city_municipality_code+` value="`+ value.barangay_description+`">`+value.barangay_description+`</option>`;
            });
            select.empty();
            select.append(option);
        },
        error:function(a,b,c)
        {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    })
}

/*===================== Begin Board Members ======================*/
    var _displayBoardEl = function (isOld) {
        if( boardMembers.length > 0)
        {
            if (isOld)
            {
                var output = "";
                $.each(boardMembers, function(index, value) {
                    output += '<div id="'+value.divID+'" class="col-lg-12 mt-0">\
                                <div class="form-group row align-items-center mb-1">\
                                    <div class="col-md-3 col-sm-6 mr-0 pr-0">\
                                        <input type="text" class="form-control" name="'+value.boardLName+'" placeholder="Last name"/>\
                                    </div>\
                                    <div class="col-md-3 col-sm-6 mr-0 pr-0 ml-0 pl-0">\
                                        <input type="text" class="form-control" name="'+value.boardFName+'" placeholder="First name"/>\
                                    </div>\
                                    <div class="col-md-3 col-sm-6 ml-0 pl-0">\
                                        <input type="text" class="form-control" name="'+value.boardMName+'" placeholder="Middle name"/>\
                                    </div>\
                                    <div class="col-md-2 col-sm-3">\
                                        <input type="text" class="form-control" name="'+value.boardPhone+'" placeholder="Contact" />\
                                    </div>\
                                    <div class="col-md-1 col-sm-3">\
                                        <button type="button" class="btn btn-sm btn-light-danger text-center" onclick="_removeBoardEl('+index+','+value.divID+')">\
                                            <i class="la la-trash-o"></i>\
                                        </button>\
                                    </div>\
                                </div>\
                            </div>';
                });
                $("#divBoardHasElement").empty();
                $("#divBoardHasElement").append(output);

                $.each(boardMembers, function(index, value) {
                    $("input[name='"+value.boardLName+"']").val(value.boardLNameVal);
                    $("input[name='"+value.boardFName+"']").val(value.boardFNameVal);
                    $("input[name='"+value.boardMName+"']").val(value.boardMNameVal);
                    $("input[name='"+value.boardPhone+"']").val(value.boardPhoneVal);
                });
            }
            else
            {
                var output = "";
                $.each(boardMembers, function(index, value) {
                    output = '<div id="'+value.divID+'" class="col-lg-12 mt-0">\
                            <div class="form-group row align-items-center mb-1">\
                                <div class="col-md-3 col-sm-6 mr-0 pr-0">\
                                    <input type="text" class="form-control" name="'+value.boardLName+'" placeholder="Last name" />\
                                </div>\
                                <div class="col-md-3 col-sm-6 mr-0 pr-0 ml-0 pl-0">\
                                    <input type="text" class="form-control" name="'+value.boardFName+'" placeholder="First name" />\
                                </div>\
                                <div class="col-md-3 col-sm-6 ml-0 pl-0">\
                                    <input type="text" class="form-control" name="'+value.boardMName+'" placeholder="Middle name" />\
                                </div>\
                                <div class="col-md-2 col-sm-3">\
                                    <input type="text" class="form-control" name="'+value.boardPhone+'" placeholder="Contact" />\
                                </div>\
                                <div class="col-md-1 col-sm-3">\
                                    <button type="button" class="btn btn-sm btn-light-danger text-center" onclick="_removeBoardEl('+index+','+value.divID+')">\
                                        <i class="la la-trash-o"></i>\
                                    </button>\
                                </div>\
                            </div>\
                        </div>';
                });
                $("#divBoardHasElement").append(output);
            }
            $("#divBoardNoElement").hide(0);
            $("#divBoardHasElement").show(0);
        }
        else
        {
            $("#divBoardHasElement").hide(0);
            $("#divBoardNoElement").show(0);
        }
    }

    var _addBoardEl = function() {
        var data = {}
        data['divID']      = 'divBoardEl'+countBoard;
        data['boardLName'] = 'boardLName'+countBoard;
        data['boardFName'] = 'boardFName'+countBoard;
        data['boardMName'] = 'boardMName'+countBoard;
        data['boardPhone'] = 'boardPhone'+countBoard;
        boardMembers.push(data);
        _displayBoardEl(false);
    }

    var _removeBoardEl = function(i, div) {
        Swal.fire({
            title: "Confirmation",
            text: "Are you sure you want to remove this?!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, please!",
            cancelButtonText: "No, cancel!",
            customClass: {
               confirmButton: "btn btn-danger mt-0"
            },
            reverseButtons: true
        }).then(function(result) {
            if (result.value) {
                $.each(boardMembers, function(index, item) {
                    if(parseInt(index) == parseInt(i)) {
                        boardMembers.splice(i, 1);
                        return false;
                    }
                });
                div.remove();
                if( boardMembers.length <= 0 ){
                    countBoard = 0;
                    $("#divBoardHasElement").hide(0);
                    $("#divBoardNoElement").show(0);
                }
            }
        });
    }
/*=====================   End Board Members ======================*/

/*===================== Begin Business Lines =====================*/
    var lineAction        = "Add";
    var lineIndex         = "";

    var KTAdd = function(id, desc, classID) {
        $("#bussCapitalAmount").val('');
        bussID       = id;
        bussLineDesc = desc;
        bussClassID  = classID;
        var exists = false;
        $.each(bussLines, function(index, item){
            if(item.bussClassID == bussClassID) {
                exists = true;
                return false;
            }
        });
        if( !exists ) {
            lineAction = "Add";
            lineIndex  = "";
            $("#grossModal").modal('show');
            $("#spanBussLineLabel").text(bussLineDesc);
            $("#bussCapitalAmount").focus();
            $("#btn_action").text("Add");
        } else {
            var content = {};
            content.message = 'This line has already been added.';
            $.notify(content, {
                type: "danger",
                allow_dismiss: true,
                newest_on_top: true,
                mouse_over:  false,
                showProgressbar:  false,
                spacing: 10,
                timer: 1000,
                placement: {
                    from: "top",
                    align: "center"
                },
                offset: {
                    x: 30,
                    y: 30
                },
                delay: 1000,
                z_index: 10000,
                animate: {
                    enter: 'animate__animated animate__pulse',
                    exit: 'animate__animated animate__bounce'
                }
            });
        }
    }

    var KTRemove = function(i) {
        $.each(bussLines, function(index, item) {
            if(parseInt(index) == parseInt(i)) {
                bussLines.splice(i, 1);
                return false;
            }
        });
        KTDisplayBussLines();
    }

    var KTEditCapital = function (index, capital, bussLineDesc) {
        lineAction = "Update";
        lineIndex  = index;
        $("#grossModal").modal('show');
        $("#spanBussLineLabel").text(decodeURIComponent(bussLineDesc));
        $("#bussCapitalAmount").val(capital).focus();
        $("#btn_action").text("Update");
    }

    var KTDisplayBussLines = function() {
        var output = "";
        $.each(bussLines, function(index, item){
            if( !item.isLocked )
            {
                output  += '<span class="label label-xl label-success label-pill label-inline mr-5 mt-2 p-10">\
                                <a type="button" onclick=KTEditCapital('+index+','+item.bussCapitalAmount+',"'+encodeURIComponent(item.bussLineDesc)+'")>'
                                    + item.bussLineDesc + " <br> BUSINESS CAPITAL - ₱ " + KTAddComma(item.bussCapitalAmount) +
                                '</a><i class="fa fa-times text-light ml-3 pointer" onclick=KTRemove('+index+')></i>\
                            </span>';
            }
        });
        $('#selectedCategory').empty();
        $('#selectedCategory').append(output);
    }

    var KTAddComma = function(val) {
        while (/(\d+)(\d{3})/.test(val.toString())){
          val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        return val;
    }

    var KTEditBussLine = function(id, bussClassID, capital) {
        $.ajax({
            url : load_buss_lines_url,
            type: "post",
            data: { 
                genID       : GenID,
                bussClassID : bussClassID
            },
            complete:function() {
                $("#editBussLineModal").modal('show');
                $("select[name='bussLine']").val(bussClassID).selectpicker("refresh");
                $("input[name='editBussCapitalAmount']").val(capital);
            },
            success:function(res) {
                LineID = id;
                var select = $("select[name='bussLine']");
                var option = "";
                $.each(res, function(index, value){
                    option += "<option value='"+value.bussclass_id+"'>";
                    option += value.businessline_desc;
                    option += "</option>";
                })
                select.empty();
                select.append(option).selectpicker('refresh');
            },
            error : function (a,b,c) {
                select.empty();
                forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
            }
        })
    }

    var KTDeleteBussLine = function (id, status) {
        var statusProp = {
            1: {'title': 'Inactive', 'class': 'label-light-danger'},
            0: {'title': 'Active', 'class': ' label-light-primary'},
        };
        var statusLabel = '<span class="label ' + statusProp[status].class + ' label-inline font-weight-bold label-lg">' + statusProp[status].title + '</span>';
        Swal.fire({
            title: "Warning",
            html: "Are you sure you want to change the status to " + statusLabel,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, please!",
            cancelButtonText: "No, cancel!",
            customClass: {
               confirmButton: "btn btn-danger mt-0"
            },
            reverseButtons: true
        }).then(function(result) {
            if (result.value) {
                $.ajax({
                    url : delete_buss_line_url,
                    type: "post",
                    data: { 
                        lineID : id, 
                        status : status,
                        genID  : GenID
                    },
                    beforeSend : function() {
                        _beforeSend();
                    },
                    complete : function() {
                        _complete();
                    },
                    success : function(res) {
                        if ( typeof res != "string" ) {
                            forSwal("Business Lines Status has been successfully changed!", "success", "btn-success");
                            _currentLinesTable(res);
                        } else {
                            res = res.trim();
                            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                        }
                    },
                    error : function(a,b,c) {
                        forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                    }
                })
            }
        });
    }
/*=====================   End Business Lines =====================*/

/*===================== Begin Requirements =======================*/
    //Requirement Type
    $("select[name='reqType']").change(function(){
        var select = $("select[name='reqDesc']");
        var file   = $("input[name='file']");
        if ( $(this).val() != "") {
            $.ajax({
                url : fetch_requirements_url,
                type: "post",
                data: { assessment_type : $(this).val() },
                beforeSend: function () {
                    file.prop('disabled', true);
                    select.prop('disabled', true).selectpicker('refresh');
                },
                complete: function () {
                    file.prop('disabled', false);
                    select.prop('disabled', false).selectpicker('refresh');
                },
                success: function( res ) {
                    var option = "";
                    $.each(res, function(index, value) {
                        option += "<option value='"+value.id+"'>";
                        option += value.description;
                        option += "</option>";
                    })
                    select.empty();
                    select.append(option).selectpicker('refresh');
                },
                error: function( a,b,c ) {
                    forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                }
            })
        } else {
            select.empty();
            select.prop('disabled', true).selectpicker('refresh');
            file.prop('disabled', true);
        }
    })
/*=====================   End Requirements =======================*/

/*===================== Begin Make Table =====================*/
    // for Current Business Lines
    var _currentLinesTable = function (res) {
        var lineData = "";
        var tblLines = $("#tblCurrentLines tbody");
        tblLines.empty();
        $.each(res, function(index, value){
            var status = {
                0: {'title': 'Inactive', 'class': 'label-light-danger'},
                1: {'title': 'Active', 'class': ' label-light-primary'},
            };
            var statusLabel = '<span class="label ' + status[value.Status].class + ' label-inline font-weight-bold label-lg">' + status[value.Status].title + '</span>';
            lineData += '<tr>';
            lineData += '<td>' + value.BussLine + '</td>';
            lineData += '<td>' + value.BussCat + '</td>';
            lineData += '<td>' + statusLabel + '</td>';
            lineData += '<td class="text-right">₱ ' + KTAddComma(value.Capital) + '</td>';
            lineData += '<td class="text-center">' + _bussLineButton(value.ID, value.BussClassID, value.Capital, value.Status) + '</td>';
            lineData += '</tr>';
            var line = { 
                "bussLineDesc"      : value.BussLine,
                "bussClassID"       : value.BussClassID,
                "bussCapitalAmount" : value.Capital,
                "isLocked"          : true
            };
            bussLines.push(line);
        });
        tblLines.append(lineData);
    }

    var _bussLineButton = function(id, bussClassID, capital, status) {
        var button = "";
        button += "<a type='button' class='btn btn-sm btn-clean btn-icon mr-2' data-container='body' data-toggle='tooltip' data-placement='top' title='Edit Details' onclick=KTEditBussLine("+id+","+bussClassID+","+capital+")><i class='flaticon-edit text-success'></i></a>";
        button += "<a type='button' class='btn btn-sm btn-clean btn-icon mr-2' data-container='body' data-toggle='tooltip' data-placement='top' title='Change Status' onclick=KTDeleteBussLine("+id+","+status+")><i class='flaticon2-refresh text-primary'></i></a>";
        return button;
    }


    //Make table for Submitted Requirements
    var _bussReqsTable = function (res) {
        var reqsData = "";
        var tblReqs  = $("#tblReqs tbody");
        tblReqs.empty();
        $.each(res, function(index, value){
            var file = value.filename.split('.')[1]+'.svg';
            reqsData += '<tr>';
            reqsData += '<td width="350">' + value.description + '</td>';
            reqsData += '<td>\
                            <a href="/bplofiles/'+GenID+'/'+value.filename+'" target="_blank">\
                                <img class="max-h-30px" src="../../assets/media/svg/files/'+file+'" />\
                            </a>\
                        </td>';
            reqsData += '<td>' + value.created_at + '</td>';
            reqsData += '<td>' + value.lname + '</td>';
            reqsData += '<td>' + _bussReqsButton(value.id) + '</td>';
            reqsData += '</tr>';
        })
        tblReqs.append(reqsData);
    }

    var _bussReqsButton = function(id) {
        var button = "";
        button += "<a type='button' class='btn btn-sm btn-clean btn-icon mr-2'><i class='flaticon-edit text-success'></i></a>";
        button += "<a type='button' class='btn btn-sm btn-clean btn-icon mr-2'><i class='flaticon2-rubbish-bin-delete-button text-danger'></i></a>";
        return button;
    }
/*=====================   End Make Table =====================*/

var KTUpdateInfo = function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    
    /*===================== Begin Navigations =====================*/
        $("#navOption1").click(function() {
            _togglePanel("#divBussDetails");
        });

        $("#navOption2").click(function() {
            _togglePanel("#divBussOrg");
        });

        $("#navOption3").click(function() {
            _togglePanel("#divBussIDS");
        });

        var loadAllBussLines = false;
        $("#navOption4").click(function() {
            _togglePanel("#divBussLines");
            if ( !loadAllBussLines ) {
                _loadBusinessLine();
                loadAllBussLines = true;
            }
        })

        $("#navOption5").click(function() {
            _togglePanel("#divBussRequirements");
        })

        var _togglePanel = function(panel) {
            $(".divPanels").hide(0);
            $(panel).show(0);
        }
    /*=====================   End Navigations =====================*/

    /*===================== Begin Business ID =====================*/
        $("#btnSearch").on('click', function(){
            var genID = $('#genID').val();
            if (genID == "") {
                $('#genID').focus();
            }
            else {
                _fetchBussDetails(genID)
            }
        })

        $("#btnCancel").on('click', function(){
            _onLoad();
            $("#genID").val('210700001');
        })
    /*=====================   End Business ID =====================*/

    /*===================== Begin Form Action =====================*/
        //Owner's Address
            $("select[name='ownersRegion']").on('change', function(){
                $("select[name='ownersProvince']").removeAttr('disabled');
                var regionCode = this.options[this.selectedIndex].id;
                $("select[name='ownersProvince'] option").hide();
                $("select[name='ownersProvince']").children("option[class^="+regionCode + "]").show();
            });

            $("select[name='ownersProvince']").on('change', function(){
                $("select[name='ownersCity']").removeAttr('disabled');
                var provinceCode = this.options[this.selectedIndex].id;
                $("select[name='ownersCity'] option").hide();
                $("select[name='ownersCity']").children("option[class^="+provinceCode + "]").show();
            });

            $('[name=ownersCity]').on('change', function(){
                $('[name=ownersBarangay]').removeAttr('disabled');
                var cityCode = this.options[this.selectedIndex].id;
                KTDisplayBarangay(cityCode);
            });
        //Owner's Address

        //Location Type
            $("input[name='locationType']").on('click', function(){
                if($(this).val() == "Rent") {
                    $("#divAgreementDetails").hide(0);
                    $("#divLeasingDetails").show(0);
                } else if ( $(this).val() == "Others" ) {
                    $("#divLeasingDetails").hide(0);
                    $("#divAgreementDetails").show(0);
                } else {
                    $("#divLeasingDetails").hide(0);
                    $("#divAgreementDetails").hide(0);
                }
            });
        //Location Type

        //Leasing Owner
            $("select[name='leasingOwner']").change(function() {
                $("#divLeasingDetails").show(0);
                if ($(this).val() == "Personal" ) {
                    $("#divLeaseCompany").hide(0);
                    $("#divLeasePerson").show(0);
                } else {
                    $("#divLeasePerson").hide(0);
                    $("#divLeaseCompany").show(0);
                }
            });
        //Leasing Owner

        //Board Members
            $("select[name='organizationType']").change(function(){
                if($(this).val() != 5 && $(this).val() != "") {
                    $(".divBoards").show(0);
                } else {
                    $(".divBoards").hide(0);
                }
            });

            //Add Board
            $("#btnAddBoard").click(function() {
                countBoard++;
                _addBoardEl();
            });
        //Board Members

        //Business Lines
            $("#bussCapitalAmount").on('keyup', function (e) {
                if (e.key === 'Enter' || e.keyCode === 13) {
                    if ( lineAction == "Add") {
                        _add();
                    } else {
                        _update();
                    }
                }
            });

            $("#btn_action").click(function() {
                _add();
            });

            $("#btn_reset").click(function(){
                bussLines = new Array();
                KTDisplayBussLines();
            });

            $("#btn_action").click(function() {
                if( lineAction == "Add") {
                    _add();
                } else {
                    _update();
                }
            });

            var _add = function() {
                var bussCapitalAmount = $("#bussCapitalAmount").val();
                if(bussCapitalAmount != "" && bussCapitalAmount != 0) {
                    if(bussLines.length < 0) 
                    {
                        var data = { 
                            "id"                : bussID,
                            "bussLineDesc"      : bussLineDesc,
                            "bussCapitalAmount" : bussCapitalAmount,
                            "bussClassID"       : bussClassID,
                            "isLocked"          : false
                        };
                        bussLines.push(data);
                        KTDisplayBussLines();
                    } 
                    else 
                    {
                        var data = { 
                            "id"                : bussID,
                            "bussLineDesc"      : bussLineDesc,
                            "bussCapitalAmount" : bussCapitalAmount,
                            "bussClassID"       : bussClassID,
                            "isLocked"          : false
                        };
                        bussLines.push(data);
                        KTDisplayBussLines();
                    }
                    $("#bussCapitalAmount").val('');
                    $("#grossModal").modal('hide');
                } else {
                    $("#bussCapitalAmount").focus();
                }
            }

            var _update = function() {
                var bussCapitalAmount = $("#bussCapitalAmount").val();
                if(bussCapitalAmount != "" && bussCapitalAmount != 0) {
                    $.each(bussLines, function (index, value) {
                        if ( lineIndex == index) {
                            value.bussCapitalAmount = bussCapitalAmount;
                            return false;
                        }
                    })
                    KTDisplayBussLines();
                    $("#bussCapitalAmount").val('');
                    $("#grossModal").modal('hide');
                } else {
                    $("#bussCapitalAmount").focus();
                }
            }

            //Save only in business line
            $("#btnSaveOnly").click(function(){
                var countLines = 0;
                $.each(bussLines, function(index, value) {
                    if ( !value.isLocked ) {
                        countLines++;
                    }
                });
                var word1, word2 = "";
                if ( countLines > 1 ) {
                    word1 = "these";
                    word2 = "Lines";
                } else {
                    word1 = "this";
                    word2 = "Line";
                }

                if ( countLines > 0 )
                {
                    Swal.fire({
                        title: "Confirmation",
                        html: "Are you sure you want to add " + word1 + " Business " + word2 + "?",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "Yes, please!",
                        cancelButtonText: "No, cancel!",
                        customClass: {
                           confirmButton: "btn btn-primary mt-0"
                        },
                        reverseButtons: true
                    }).then(function(result) {
                        if (result.value) {
                            $.ajax({
                                url : add_buss_line_url,
                                type: "post",
                                data: {
                                    genID : GenID,
                                    bussLines : JSON.stringify(bussLines),
                                    addType : 1 // Save only
                                },
                                beforeSend : function () {
                                    _beforeSend();
                                },
                                complete : function() {
                                    _complete();
                                },
                                success : function(res) {
                                    if (typeof res != "string") {
                                        $.each(bussLines, function(index, item) {
                                            item.isLocked = true;
                                        });
                                        _currentLinesTable(res);
                                        KTDisplayBussLines();
                                        forSwal("Business Line has been successfully added.", "success", "btn-success");
                                    } else {
                                        forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                                    }
                                },
                                error : function(a,b,c) {
                                    forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                                }
                            })
                        }
                    });
                }
                else
                {
                    var content = {};
                    content.message = 'Please select business line';
                    $.notify(content, {
                        type: "danger",
                        allow_dismiss: true,
                        newest_on_top: true,
                        mouse_over:  false,
                        showProgressbar:  false,
                        spacing: 10,
                        timer: 1000,
                        placement: {
                            from: "top",
                            align: "right"
                        },
                        offset: {
                            x: 30,
                            y: 30
                        },
                        delay: 1000,
                        z_index: 10000,
                        animate: {
                            enter: 'animate__animated animate__pulse',
                            exit: 'animate__animated animate__bounce'
                        }
                    });
                }
            })
        //Business Lines
    /*=====================   End Form Action =====================*/

    /*===================== Begin Form Submit =====================*/
        //form buss details
        $("#form_buss_details").on('submit', function(e) {
            e.preventDefault();
            var fd = new FormData($(this)[0]);
            fd.append('genID', GenID);
            _submitForm(fd, 'Business Details', update_buss_details_url);
        })

        //form address details
        $("#form_addr_details").on('submit', function(e) {
            e.preventDefault();
            var fd = new FormData($(this)[0]);
            fd.append('genID', GenID);
            _submitForm(fd, 'Address Details', update_addr_details_url);
        })

        //form location details
        $("#form_loc_details").on('submit', function(e) {
            e.preventDefault();
            var fd = new FormData($(this)[0]);
            fd.append('genID', GenID);
            _submitForm(fd, 'Location Details', update_loc_details_url);
        })

        //form buss org contact person
        $("#form_org_contact").on('submit', function(e) {
            e.preventDefault();
            var fd = new FormData($(this)[0]);
            fd.append('genID', GenID);
            fd.append('update_type', 0);
            _submitForm(fd, 'Contact Person Details', update_buss_org_url);
        })

        //form buss org owner / president
        $("#form_org_owner").on('submit', function(e) {
            e.preventDefault();
            var fd = new FormData($(this)[0]);
            fd.append('genID', GenID);
            fd.append('update_type', 1);
            _submitForm(fd, 'Owner / President Details', update_buss_org_url);
        })

        //form buss org owner person
        $("#form_org_other").on('submit', function(e) {
            e.preventDefault();
            var fd = new FormData($(this)[0]);
            fd.append('genID', GenID);
            fd.append('update_type', 2);
            fd.append('boardMembers', boardMembers)
            _submitForm(fd, 'Business Organization Other Details', update_buss_org_url);
        })

        //form business ids
        $("#form_buss_ids").on('submit', function(e) {
            e.preventDefault();
            var fd = new FormData($(this)[0]);
            fd.append('genID', GenID);
            _submitForm(fd, 'Business Identifications', update_buss_ids_url);
        });

        //form update business line
        $("#form_edit_buss_line").on('submit', function(e) {
            e.preventDefault();
            var fd = new FormData($(this)[0]);
            fd.append('genID', GenID);
            fd.append('lineID', LineID);
            _submitForm(fd, 'Business Line', update_buss_line_url);
        });
    /*=====================   End Form Submit =====================*/


    //Fetch Details
    var _fetchBussDetails = function(genID) {
        $.ajax({
            url: fetch_business_details_url,
            type: "post",
            data: { genID : genID },
            dataType: 'json',
            beforeSend: function(){
                _beforeSend();
            },
            complete: function(){
                _complete();
            },
            success:function(res) {
                countBoard   = 0;
                boardMembers = new Array();
                if (res == "not_found") {
                    _onLoad();
                    GenID    = "";
                    hasFound = false;
                } else if(res == "failed") {
                    hasFound = false;
                    forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                }
                else {
                    GenID    = genID;
                    hasFound = true;
                    $("#divNoFound").hide(0);
                    $("#divOptions").removeClass('no-drop');
                    $("#divOptionCard").removeClass('not-available');
                    $("#divHasFound").show(0);
                    $(".navi-link").css('pointer-events', 'auto');
                    $("#navOption1").click();

                    var locType = "";
                    var lessorFname, lessorLname, lessorMname, lessorCname, leaseAmount, lessorAddress, leaseOwner = "";
                    var contactLname, contactFname, contactMname, contactPhone = "";
                    var ownerLname, ownerFname, ownerMname, ownerPhone, ownerEmail = "";
                    var ownerHouseNo, ownerBldgNo, ownerSubd, ownerBrgy, ownerCity, ownerProv, ownerRegion = "";

                    //Buss Org Details & Owner Address
                    $.each(res.bussOrg, function(index, value){
                        if(value.member_code == "1001") {
                            ownerLname   = value.lname;
                            ownerFname   = value.fname;
                            ownerMname   = value.mname;
                            ownerPhone   = value.contact;
                            ownerEmail   = value.email;
                            ownerHouseNo = value.house_no;
                            ownerBldgNo  = value.building_no;
                            ownerSubd    = value.street_subd;
                            ownerRegion  = value.region;
                            ownerProv    = value.province;
                            ownerCity    = value.city;
                            ownerBrgy    = value.brgy;
                        }
                        else if(value.member_code == "1002") {
                            contactLname  = value.lname;
                            contactFname  = value.fname;
                            contactMname  = value.mname;
                            contactPhone  = value.contact;
                        }
                        else if(value.member_code == "1003") {
                            var data = {};
                            data['divID']      = 'divBoardEl'+countBoard;
                            data['boardLName'] = 'boardLName'+countBoard;
                            data['boardFName'] = 'boardFName'+countBoard;
                            data['boardMName'] = 'boardMName'+countBoard;
                            data['boardPhone'] = 'boardPhone'+countBoard;

                            data['boardLNameVal'] = value.lname;
                            data['boardFNameVal'] = value.fname;
                            data['boardMNameVal'] = value.mname;
                            data['boardPhoneVal'] = value.contact;
                            boardMembers.push(data);
                            countBoard++;
                        }
                    });

                    //Buss Details
                    $('[name=businessName]').val(res.bussDetails.buss_name);
                    $('[name=franchiseName]').val(res.bussDetails.franchise_name);
                    $('[name=bussEmail]').val(res.bussDetails.buss_email);
                    $('[name=bussPhone]').val(res.bussDetails.buss_phone);
                    $('[name=bussTIN]').val(res.bussDetails.buss_tin);
                    $('[name=isBranch]').val(res.bussDetails.is_branch);

                    //Address
                    $('[name=businessHouseNo]').val(res.bussDetails.buss_houseno);
                    $('[name=businessBuildingName]').val(res.bussDetails.buss_buildingno);
                    $('[name=businessSubdivision]').val(res.bussDetails.buss_street);
                    $('[name=businessBarangay]').val(res.bussDetails.buss_brgy).change();
                    $('[name=ownersHouseNo').val(ownerHouseNo);
                    $('[name=businessBuildingName]').val(ownerBldgNo);
                    $('[name=ownersSubdivision').val(ownerSubd);
                    $('[name=ownersRegion').val(ownerRegion);
                    $('[name=ownersProvince').val(ownerProv);
                    $('[name=ownersCity').val(ownerCity);
                    $('[name=ownersBarangay').val(ownerBrgy);

                    //Location Type
                    if (res.bussDetails.location_type == 1) {
                        locType = "Rent";
                        var ownerType = ( res.bussLocDetails.owner_type == 1 ) ? "Personal" : "Company";
                        $('[name=leasingOwner]').val(ownerType).change();
                        $('[name=leaseAmount]').val(res.bussLocDetails.lease_amount);
                        $('[name=leaseEmail]').val(res.bussLocDetails.email);
                        $('[name=leaseContact]').val(res.bussLocDetails.contact);
                        $('[name=lessorsAddress]').val(res.bussLocDetails.address);
                        if ( res.bussLocDetails.owner_type == 1 ) {
                            $('[name=lessorsLname]').val(res.bussLocDetails.lname);
                            $('[name=lessorsFname]').val(res.bussLocDetails.name);
                            $('[name=lessorsMname]').val(res.bussLocDetails.mname);
                        } else {
                            $('[name=lessorsCname]').val(res.bussLocDetails.name);
                        }
                    } else if ( res.bussDetails.location_type == 2 ) {
                        locType = "Others";
                        $('[name=agreementType]').val(res.bussLocDetails.agreement_type);
                        $('[name=leaseAgreement]').val(res.bussLocDetails.agreement_desc);
                    } else {
                        locType = "Owned";
                    }

                    $('[name=businessArea]').val(res.bussDetails.floor_area);
                    $('[name=locationType]').filter('[value='+locType+']').prop('checked', true).click();

                    //Contact Person
                    $('[name=contactLname').val(contactLname);
                    $('[name=contactFname').val(contactFname);
                    $('[name=contactMname').val(contactMname);
                    $('[name=contactPhone').val(contactPhone);

                    //Owner / President
                    $('[name=ownerLname').val(ownerLname);
                    $('[name=ownerFname').val(ownerFname);
                    $('[name=ownerMname').val(ownerMname);
                    $('[name=ownersPhone').val(ownerPhone);
                    $('[name=ownersEmail').val(ownerEmail);

                    //Others
                    $('[name=organizationType]').val(res.bussDetails.tblbplobusinesstype_id).change();
                    $('[name=businessSize]').val(res.bussDetails.tblbplobusinesssize_id);
                    _displayBoardEl(true);

                    //IDS
                    $('[name=sec_number]').val(res.bussIDS.sec_number);
                    $('[name=sec_date]').val(res.bussIDS.sec_date);
                    $('[name=sec_expiry]').val(res.bussIDS.sec_expiry);
                    $('[name=dti_number]').val(res.bussIDS.dti_number);
                    $('[name=dti_date]').val(res.bussIDS.dti_date);
                    $('[name=dti_expiry]').val(res.bussIDS.dti_expiry);
                    $('[name=cda_number]').val(res.bussIDS.cda_number);
                    $('[name=cda_date]').val(res.bussIDS.cda_date);
                    $('[name=cda_expiry]').val(res.bussIDS.cda_expiry);
                    $('[name=sss_number]').val(res.bussIDS.sss_number);
                    $('[name=sss_date]').val(res.bussIDS.sss_date);
                    $('[name=sss_expiry]').val(res.bussIDS.sss_expiry);
                    $('[name=bc_number]').val(res.bussIDS.bc_number);
                    $('[name=bc_date]').val(res.bussIDS.bc_date);
                    $('[name=bc_expiry]').val(res.bussIDS.bc_expiry);
                    $('[name=peza_number]').val(res.bussIDS.peza_number);
                    $('[name=peza_date]').val(res.bussIDS.peza_date);
                    $('[name=peza_expiry]').val(res.bussIDS.peza_expiry);

                    //Current Business Line
                    _currentLinesTable(res.bussLines);
                    

                    //All Requirments
                    _bussReqsTable(res.bussReqs);
                    
                }
            },
            error:function(a,b,c) {
                forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
            }
        })
    }

    //Submit Form
    var _submitForm = function(_formData, panel, _url) {
        if ( hasFound ) //Found one
        {
            var msg = "<b>Are you sure, you want to update this?!</b> <br><br>\
                        <div class='form-group row p-0 m-0'>\
                            <label class='col-5 text-right'>Panel: </label>\
                            <div class='col-7 text-left'>\
                                <span class='label label-outline-success label-inline label-xl'>"+ panel +"</span>\
                            </div>\
                        </div>\
                        <div class='form-group row p-0 m-0 mt-2'>\
                            <label class='col-5 text-right'>Business ID: </label>\
                            <div class='col-7 text-left'>\
                                <span class='font-weight-bolder'>"+ $('#genID').val() +"</span>\
                            </div>\
                        </div>";
            Swal.fire({
                title: "Confirmation",
                html: msg,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes, please!",
                cancelButtonText: "No, cancel!",
                customClass: {
                   confirmButton: "btn btn-success mt-0"
                },
                reverseButtons: true
            }).then(function(result) {
                if (result.value) {
                    $.ajax({
                        url : _url,
                        data: _formData,
                        processData: false,
                        contentType: false,
                        type: "POST",
                        beforeSend: function() {
                            _beforeSend();
                        },
                        complete: function(xhr) {
                            _complete();
                        },
                        success:function(res)
                        {
                            if( typeof res == "string")
                            {
                                res = res.trim();
                                if ( res == "success" ) {
                                    var msg = "<b>" + panel + "</b> for <b>" + $("#genID").val() + "</b> has been successfully updated!";
                                    Swal.fire({
                                        title: 'Success!',
                                        html:  msg,
                                        icon:  "success"
                                    });
                                    if ( panel == "Location Details" )
                                    {
                                        var loc = $("input[name='locationType']:checked").val();
                                        if ( loc == "Owned" ) {
                                            _resetLocType(0);
                                        } else if ( loc == "Rent" ) {
                                            _resetLocType(1);
                                        } else {
                                            _resetLocType(2);
                                        }
                                    } 
                                }
                                else {
                                    forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                                }
                            }
                            else 
                            {
                                if ( panel == "Business Line" )
                                {
                                    $("#editBussLineModal").modal('hide');
                                    _currentLinesTable(res);
                                }
                            }
                        },
                        error:function(a,b,c)
                        {
                            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                        }
                    });
                }
            });
        }
    }

    //Reset Business Location Details on Submit
    var _resetLocType = function(loc) {
        if( loc == 0 ) // Owned
        {
            $('[name=leasingOwner]').val("Personal").change();
            $('[name=leaseAmount]').val("");
            $('[name=leaseEmail]').val("");
            $('[name=leaseContact]').val("");
            $('[name=lessorsAddress]').val("");
            $('[name=lessorsLname]').val("");
            $('[name=lessorsFname]').val("");
            $('[name=lessorsMname]').val("");
            $('[name=lessorsCname]').val("");

            $('[name=agreementType]').val(1);
            $('[name=leaseAgreement]').val("");
        }
        else if ( loc == 1 ) // Rent
        {
            if ($('[name=leasingOwner]').val() == "Personal")
            {
                $('[name=lessorsCname]').val("");
            }
            else 
            {
                $('[name=lessorsLname]').val("");
                $('[name=lessorsFname]').val("");
                $('[name=lessorsMname]').val(""); 
            }
            $('[name=agreementType]').val(1);
            $('[name=leaseAgreement]').val("");
        }

        else  // Others
        {
            $('[name=leasingOwner]').val("Personal");
            $('[name=leaseAmount]').val("");
            $('[name=leaseEmail]').val("");
            $('[name=leaseContact]').val("");
            $('[name=lessorsAddress]').val("");
            $('[name=lessorsLname]').val("");
            $('[name=lessorsFname]').val("");
            $('[name=lessorsMname]').val("");
            $('[name=lessorsCname]').val("");
        }
    }

    var _formatDate = function(date) {
        var start   = date.split("/");
        var s       = new Date(start[2], (start[0] - 1), start[1]).toString();
        s = s.split(" ");
        return s[1] + ". " + s[2] + ", " + s[3];
    }

    var _onLoad = function() {
        $(".navi-link").removeClass('active');
        $(".navi-link").css('pointer-events', 'none');
        $("#divOptions").addClass('no-drop');
        $("#divOptionCard").addClass('not-available');
        $(".divPanels").hide(0);

        $("#spanBussID").val('');
        $("#spanBussName").val('');
        $("#spanBussAddr").val('');
        $("#divNoFound").show(0);

        $("#divLeaseCompany").hide(0);
        $("#divLeasingDetails").hide(0);
        $("#divAgreementDetails").hide(0);
        $("#leaseAmountMsg").hide(0);
        $("#lessorsLnameMsg").hide(0);
        $("#lessorsFnameMsg").hide(0);
        $("#lessorsAddressMsg").hide(0);
        $("#lessorsCnameMsg").hide(0);
        $("#leaseAgreementMsg").hide(0);

        $(".divBoards").hide(0);

        hasFound = false;
    }

    var _loadBusinessLine = function() {

        if( table ) { 
            table.clear();
            table.destroy(); 
        }

        table = $('#tbl_busslines').DataTable({
            responsive: true,
            processing: true,
            serverSide: true,
            //bLengthChange: false,
            aLengthMenu: [
                [3, 10, 100, 200, -1],
                [3, 10, 100, 200, "All"]
            ],
            iDisplayLength: 3,
            language: {                
                infoFiltered: ""
            },
            ajax: {
                method : "POST",
                url    : fetch_busslines_url,
                data: {
                    columnsDef: [
                        'BussLineDesc',
                        'Action'
                    ],
                },
            },
            columns: [
                {data: 'BussLineDesc'},
                {data: 'Action', orderable:false, searchable:false},
            ],
            columnDefs: [
                {
                    targets: 0,
                    width: 600,
                },
            ]
        });
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
    KTUpdateInfo.init();
});