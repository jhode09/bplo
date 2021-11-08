"use strict";
var table;
var bussLines    = new Array();
var bussFiles    = new Array();
var boardMembers = new Array();
var countBoard   = 0;
var GenID, bussLineDesc, bussClassID;

// Class definition
menuActive('li-menu-bplo', 'li-submenu-permitapp', 'li-lastmenu-permitapp-renewapp');

// ========== BEGIN STEP 1 ========== //
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
// ==========   END STEP 1 ========== //

// ========== BEGIN STEP 2 ========== //
    var _displayBoardEl = function () {
        if( boardMembers.length > 0)
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
                                <div class="col-md-3 col-sm-3">\
                                    <input type="text" class="form-control" name="'+value.boardPhone+'" placeholder="Contact"/>\
                                </div>\
                            </div>\
                        </div>';
            });
            $("#divBoardHasElement").empty();
            $("#divBoardHasElement").append(output);
            $.each(boardMembers, function(index, value) {
                $("input[name='"+value.boardLName+"']").val(value.boardLNameVal).attr('readonly', true);
                $("input[name='"+value.boardFName+"']").val(value.boardFNameVal).attr('readonly', true);
                $("input[name='"+value.boardMName+"']").val(value.boardMNameVal).attr('readonly', true);
                $("input[name='"+value.boardPhone+"']").val(value.boardPhoneVal).attr('readonly', true);
            });
            $("#divBoardNoElement").hide(0);
            $("#divBoardHasElement").show(0);
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
        _displayBoardEl();
    }

    var _removeBoardEl = function(i, div) {
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
// ==========   END STEP 2 ========== //

// ========== BEGIN STEP 4 ========== //
    /*var KTAdd = function(id, desc) {
        bussID       = id;
        bussLineDesc = desc;
        var exists = false;
        $.each(bussLines, function(index, item){
            if(item.id == bussID) {
                exists = true;
                return false;
            }
        });
        if( !exists ) {
            $("#grossModal").modal('show');
            $("#bussCapitalAmount").focus();
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

    var KTDisplayBussLines = function() {
        if(bussLines.length <= 0) { 
            $("#noSelected").prop("hidden", false);
            $("#btn_reset").hide(0); 
        } else {
             $("#noSelected").prop("hidden", true);
            $("#btn_reset").show(0); 
        }
        $('#selectedCategory').empty();
        $.each(bussLines, function(index, item){
            var output = '<span class="label label-xl label-success label-pill label-inline mr-5 mt-2 p-10">'
                                + item.bussLineDesc + " <br> BUSINESS CAPITAL - ₱ " + _commaSeparateNumber(item.bussCapitalAmount) +
                                '<i class="fa fa-times text-light ml-3 pointer" onclick=KTRemove('+index+')></i>\
                            </span>';
            $('#selectedCategory').append(output);
        });
    }

    var _commaSeparateNumber = function(val) {
        while (/(\d+)(\d{3})/.test(val.toString())){
          val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        return val;
    }*/
// ==========   END STEP 4 ========== //

// ========== BEGIN STEP 5 ========== //
    var FileSelect = function(chk, file) {
        var bool = false;
        if( file != "") {
            bool = true;
        }
        $("input[name='"+chk+"']").prop("checked", bool);
    }

    var DeleteFile = function(chk, file, lbl) {
        $("input[name='"+chk+"']").prop("checked", false);
        $("#" + lbl).text('Choose file');
        $("#" + file).val('');
    }
// ==========   END STEP 5 ========== //

var KTRenewApplication = function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $("#btnSearch").on('click', function(){
        var genID = $('#genID').val();
        if (genID == "") {
            $('#genID').focus();
        }
        else {
            fetchBussDetails(genID)
        }
    })

    var fetchBussDetails = function(genID) {
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
                $("#form_renew")[0].reset();
                var svgs = [
                    '',
                    '<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect x="0" y="0" width="24" height="24"/><path d="M13.5,21 L13.5,18 C13.5,17.4477153 13.0522847,17 12.5,17 L11.5,17 C10.9477153,17 10.5,17.4477153 10.5,18 L10.5,21 L5,21 L5,4 C5,2.8954305 5.8954305,2 7,2 L17,2 C18.1045695,2 19,2.8954305 19,4 L19,21 L13.5,21 Z M9,4 C8.44771525,4 8,4.44771525 8,5 L8,6 C8,6.55228475 8.44771525,7 9,7 L10,7 C10.5522847,7 11,6.55228475 11,6 L11,5 C11,4.44771525 10.5522847,4 10,4 L9,4 Z M14,4 C13.4477153,4 13,4.44771525 13,5 L13,6 C13,6.55228475 13.4477153,7 14,7 L15,7 C15.5522847,7 16,6.55228475 16,6 L16,5 C16,4.44771525 15.5522847,4 15,4 L14,4 Z M9,8 C8.44771525,8 8,8.44771525 8,9 L8,10 C8,10.5522847 8.44771525,11 9,11 L10,11 C10.5522847,11 11,10.5522847 11,10 L11,9 C11,8.44771525 10.5522847,8 10,8 L9,8 Z M9,12 C8.44771525,12 8,12.4477153 8,13 L8,14 C8,14.5522847 8.44771525,15 9,15 L10,15 C10.5522847,15 11,14.5522847 11,14 L11,13 C11,12.4477153 10.5522847,12 10,12 L9,12 Z M14,12 C13.4477153,12 13,12.4477153 13,13 L13,14 C13,14.5522847 13.4477153,15 14,15 L15,15 C15.5522847,15 16,14.5522847 16,14 L16,13 C16,12.4477153 15.5522847,12 15,12 L14,12 Z" fill="#000000"/><rect fill="#FFFFFF" x="13" y="8" width="3" height="3" rx="1"/><path d="M4,21 L20,21 C20.5522847,21 21,21.4477153 21,22 L21,22.4 C21,22.7313708 20.7313708,23 20.4,23 L3.6,23 C3.26862915,23 3,22.7313708 3,22.4 L3,22 C3,21.4477153 3.44771525,21 4,21 Z" fill="#000000" opacity="0.3"/></g></svg>',
                    '<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><polygon points="0 0 24 0 24 24 0 24"/><path d="M18,14 C16.3431458,14 15,12.6568542 15,11 C15,9.34314575 16.3431458,8 18,8 C19.6568542,8 21,9.34314575 21,11 C21,12.6568542 19.6568542,14 18,14 Z M9,11 C6.790861,11 5,9.209139 5,7 C5,4.790861 6.790861,3 9,3 C11.209139,3 13,4.790861 13,7 C13,9.209139 11.209139,11 9,11 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"/><path d="M17.6011961,15.0006174 C21.0077043,15.0378534 23.7891749,16.7601418 23.9984937,20.4 C24.0069246,20.5466056 23.9984937,21 23.4559499,21 L19.6,21 C19.6,18.7490654 18.8562935,16.6718327 17.6011961,15.0006174 Z M0.00065168429,20.1992055 C0.388258525,15.4265159 4.26191235,13 8.98334134,13 C13.7712164,13 17.7048837,15.2931929 17.9979143,20.2 C18.0095879,20.3954741 17.9979143,21 17.2466999,21 C13.541124,21 8.03472472,21 0.727502227,21 C0.476712155,21 -0.0204617505,20.45918 0.00065168429,20.1992055 Z" fill="#000000" fill-rule="nonzero"/></g></svg>',
                    '<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect x="0" y="0" width="24" height="24"/><path d="M14,16 L12,16 L12,12.5 C12,11.6715729 11.3284271,11 10.5,11 C9.67157288,11 9,11.6715729 9,12.5 L9,17.5 C9,19.4329966 10.5670034,21 12.5,21 C14.4329966,21 16,19.4329966 16,17.5 L16,7.5 C16,5.56700338 14.4329966,4 12.5,4 L12,4 C10.3431458,4 9,5.34314575 9,7 L7,7 C7,4.23857625 9.23857625,2 12,2 L12.5,2 C15.5375661,2 18,4.46243388 18,7.5 L18,17.5 C18,20.5375661 15.5375661,23 12.5,23 C9.46243388,23 7,20.5375661 7,17.5 L7,12.5 C7,10.5670034 8.56700338,9 10.5,9 C12.4329966,9 14,10.5670034 14,12.5 L14,16 Z" fill="#000000" fill-rule="nonzero" transform="translate(12.500000, 12.500000) rotate(-315.000000) translate(-12.500000, -12.500000) "/></g></svg>',
                    '<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect x="0" y="0" width="24" height="24"/><path d="M10,4 L21,4 C21.5522847,4 22,4.44771525 22,5 L22,7 C22,7.55228475 21.5522847,8 21,8 L10,8 C9.44771525,8 9,7.55228475 9,7 L9,5 C9,4.44771525 9.44771525,4 10,4 Z M10,10 L21,10 C21.5522847,10 22,10.4477153 22,11 L22,13 C22,13.5522847 21.5522847,14 21,14 L10,14 C9.44771525,14 9,13.5522847 9,13 L9,11 C9,10.4477153 9.44771525,10 10,10 Z M10,16 L21,16 C21.5522847,16 22,16.4477153 22,17 L22,19 C22,19.5522847 21.5522847,20 21,20 L10,20 C9.44771525,20 9,19.5522847 9,19 L9,17 C9,16.4477153 9.44771525,16 10,16 Z" fill="#000000"/><rect fill="#000000" opacity="0.3" x="2" y="4" width="5" height="16" rx="1"/></g></svg>',
                    '<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><polygon points="0 0 24 0 24 24 0 24"/><path d="M5.85714286,2 L13.7364114,2 C14.0910962,2 14.4343066,2.12568431 14.7051108,2.35473959 L19.4686994,6.3839416 C19.8056532,6.66894833 20,7.08787823 20,7.52920201 L20,20.0833333 C20,21.8738751 19.9795521,22 18.1428571,22 L5.85714286,22 C4.02044787,22 4,21.8738751 4,20.0833333 L4,3.91666667 C4,2.12612489 4.02044787,2 5.85714286,2 Z M10.875,15.75 C11.1145833,15.75 11.3541667,15.6541667 11.5458333,15.4625 L15.3791667,11.6291667 C15.7625,11.2458333 15.7625,10.6708333 15.3791667,10.2875 C14.9958333,9.90416667 14.4208333,9.90416667 14.0375,10.2875 L10.875,13.45 L9.62916667,12.2041667 C9.29375,11.8208333 8.67083333,11.8208333 8.2875,12.2041667 C7.90416667,12.5875 7.90416667,13.1625 8.2875,13.5458333 L10.2041667,15.4625 C10.3958333,15.6541667 10.6354167,15.75 10.875,15.75 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"/><path d="M10.875,15.75 C10.6354167,15.75 10.3958333,15.6541667 10.2041667,15.4625 L8.2875,13.5458333 C7.90416667,13.1625 7.90416667,12.5875 8.2875,12.2041667 C8.67083333,11.8208333 9.29375,11.8208333 9.62916667,12.2041667 L10.875,13.45 L14.0375,10.2875 C14.4208333,9.90416667 14.9958333,9.90416667 15.3791667,10.2875 C15.7625,10.6708333 15.7625,11.2458333 15.3791667,11.6291667 L11.5458333,15.4625 C11.3541667,15.6541667 11.1145833,15.75 10.875,15.75 Z" fill="#000000"/></g></svg>',
                    '<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect x="0" y="0" width="24" height="24"/><path d="M9,10 L9,19 L10.1525987,19.3841996 C11.3761964,19.7920655 12.6575468,20 13.9473319,20 L17.5405883,20 C18.9706314,20 20.2018758,18.990621 20.4823303,17.5883484 L21.231529,13.8423552 C21.5564648,12.217676 20.5028146,10.6372006 18.8781353,10.3122648 C18.6189212,10.260422 18.353992,10.2430672 18.0902299,10.2606513 L14.5,10.5 L14.8641964,6.49383981 C14.9326895,5.74041495 14.3774427,5.07411874 13.6240179,5.00562558 C13.5827848,5.00187712 13.5414031,5 13.5,5 L13.5,5 C12.5694044,5 11.7070439,5.48826024 11.2282564,6.28623939 L9,10 Z" fill="#000000"/><rect fill="#000000" opacity="0.3" x="2" y="9" width="5" height="11" rx="1"/></g></svg>'
                ];
                for (var i = 0; i < 7; i++) {
                    $("#iconStep"+i).html("");
                    $("#iconStep"+i).removeClass("svg-icon-white bg-success text-center done");
                    $("#iconStep"+i).html(svgs[i]);
                }

                if (res == "not_found") {
                    /*Swal.fire("Error", "Business ID not found. Please try again.", "error");*/
                    $("#form_renew").hide(0);
                    $("#divNoFound").show(0);
                } else if(res == "failed") {
                    forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
                }
                else {
                    boardMembers = new Array();
                    GenID = genID;
                    _wizard.goTo(1);
                    $("#divNoFound").hide(0);
                    $("#form_renew").show(0);
                    // step 1
                    var locType = "";
                    var lessorFname, lessorLname, lessorMname, lessorCname, leaseAmount, lessorAddress, leaseOwner = "";
                    var contactLname, contactFname, contactMname, contactPhone = "";
                    var ownerLname, ownerFname, ownerMname, ownerPhone, ownerEmail = "";
                    var ownerHouseNo, ownerSubd, ownerBrgy, ownerCity, ownerProv, ownerRegion = "";
                    var countBoard = 1;

                    //Buss Org Details & Owner Address
                    $.each(res.bussOrg, function(index, value){
                        if(value.member_code == "1001") {
                            ownerLname   = value.lname;
                            ownerFname   = value.fname;
                            ownerMname   = value.mname;
                            ownerPhone   = value.contact;
                            ownerEmail   = value.email;
                            ownerHouseNo = value.house_no;
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
                    

                    //step 2
                    $('[name=organizationType]').val(res.bussDetails.tblbplobusinesstype_id).change();
                    $('[name=businessSize]').val(res.bussDetails.tblbplobusinesssize_id);
                    $('[name=contactLname').val(contactLname);
                    $('[name=contactFname').val(contactFname);
                    $('[name=contactMname').val(contactMname);
                    $('[name=contactPhone').val(contactPhone);

                    $('[name=ownerLname').val(ownerLname);
                    $('[name=ownerFname').val(ownerFname);
                    $('[name=ownerMname').val(ownerMname);
                    $('[name=ownersPhone').val(ownerPhone);
                    $('[name=ownersEmail').val(ownerEmail);

                    _displayBoardEl();

                    //step 3
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

                    //step 4
                    var data = "";
                    var tbl  = $("#tblCurrentLines tbody");
                    tbl.empty();
                    $.each(res.bussLines, function(index, value){
                        data += '<tr>';
                        data += '<td>' + value.BussLine + '</td>';
                        data += '<td>' + value.BussCat + '</td>';
                        data += '</tr>';
                        var line = { 
                            "bussLineDesc" : value.BussLine,
                            "bussClassID"  : value.BussClassID
                        };
                        bussLines.push(line);
                    });
                    tbl.append(data);
                

                    //step 5

                }
            },
            error:function(a,b,c) {
                forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
            }
        })
    }

    // ========== BEGIN STEP 1 ========== //
        //Tin
        $("input[name='bussTIN']").keypress(function(e) {
            var input = $(this).val()
            if(input.length == 3 || input.length == 7 || input.length == 11) {
                $(this).val( input + "-");
            }
            e = (e) ? e : window.event;
            var charCode = (e.which) ? e.which : e.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
            }
            return true;
        });

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

        //Location Type - Rent, Others
        $("input[name='leaseAmount'], input[name='lessorsLname'], input[name='lessorsFname'], textarea[name='lessorsAddress'], input[name='lessorsCname'], textarea[name='leaseAgreement']").keyup(function(){
            if($(this).val() != "") {
                $(this).removeClass('is-invalid');
                $("#" + $(this).attr('name') + "Msg").hide(0);
            } else {
                $(this).addClass('is-invalid');
                $("#" + $(this).attr('name') + "Msg").show(0);
            }
        })
    // ==========   END STEP 1 ========== //
    
    // ========== BEGIN STEP 2 ========== //
        $("select[name='organizationType']").change(function(){
            if($(this).val() != 5 && $(this).val() != "") {
                $(".divBoards").show(0);
                if( $(this).val() == 3 ) {
                    $(".divReq2").show(0);
                    $(".divReq0").hide(0);
                    $(".divReq1").hide(0);
                } else {
                    $(".divReq1").show(0);
                    $(".divReq2").hide(0);
                    $(".divReq0").hide(0);
                }
            } else {
                countBoard   = 0;
                boardMembers = new Array();
                $(".divReq0").show(0);
                $(".divReq1").hide(0);
                $(".divReq2").hide(0);
                $(".divBoards").hide(0);
            }
        });

        //Add Board
        $("#btnAddBoard").click(function() {
            countBoard++;
            _addBoardEl();
        });

        $("input[name='totalFemaleEmployee'], input[name='totalMaleEmployee']").keypress(function(e) {
            e = (e) ? e : window.event;
            var charCode = (e.which) ? e.which : e.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
            }
            return true;
        });

        $("input[name='totalFemaleEmployee']").keyup(function() {
            _computeTotalEmp();
        });

        $("input[name='totalMaleEmployee']").keyup(function() {
            _computeTotalEmp();
        });

        var _computeTotalEmp = function() {
            var female = $("input[name='totalFemaleEmployee']").val();
            var male   = $("input[name='totalMaleEmployee']").val();
            var total  = 0;
            if(female != "" & male != "") {
                total = parseInt(female) + parseInt(male);
            } else if( male == "") {
                total = female;
            } else if ( female == "") {
                total = male
            }
            $("input[name='totalBuildingEmployee']").val(total);
        }
    // ==========   END STEP 2 ========== //

    // ========== BEGIN STEP 4 ========== //
        $("#bussCapitalAmount").on('keyup', function (e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                _add();
            }
        });

        $("#btn_add").click(function() {
            _add();
        });

        $("#btn_reset").click(function(){
            bussLines = new Array();
            KTDisplayBussLines();
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
                        "bussClassID"       : bussClassID
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
                        "bussClassID"       : bussClassID
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
    // ==========   END STEP 4 ========== //

    // ========== BEGIN STEP 5 ========== //
    // ==========   END STEP 5 ========== //

    // Wizard
    var _wizardEl;
    var _formEl;
    var _wizard;
    var _validations = [];

    var _onLoad = function() {
        $("#title").focus();
        $('#lessors_details').hide();
        $('#transfer-details').hide();
        $("#btn_reset").hide(0);
        $("#divLeaseCompany").hide(0);
        $("#divLeasingDetails").hide(0);
        $("#divAgreementDetails").hide(0);
        $("#divBoardsResult").hide(0);
        $(".divBoards").hide(0);
        $("#leaseAmountMsg").hide(0);
        $("#lessorsLnameMsg").hide(0);
        $("#lessorsFnameMsg").hide(0);
        $("#lessorsAddressMsg").hide(0);
        $("#lessorsCnameMsg").hide(0);
        $("#leaseAgreementMsg").hide(0);
        $("#form_renew").hide(0);
        $("#form_renew :input[type=text]").prop('readonly', true);
        $("#form_renew :input[type=number]").prop('readonly', true);
        $("#form_renew :input[type=radio]").prop('disabled', true);
        $("#form_renew :input[type=email]").prop('readonly', true);
        $("#form_renew :input[type=date]").prop('readonly', true);
        $("select").attr('disabled', true);

        $("#bussCapitalAmount").keypress(function(e){
            e = (e) ? e : window.event;
            var charCode = (e.which) ? e.which : e.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
            }
            return true;
        });

        $("input[name='bussTIN']").keypress(function(e) {
            var input = $(this).val()
            if(input.length == 3 || input.length == 7 || input.length == 11) {
                $(this).val( input + "-");
            }
            e = (e) ? e : window.event;
            var charCode = (e.which) ? e.which : e.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
            }
            return true;
        });


        //Owners Address Select
        $("select[name='ownersProvince'], select[name='ownersCity'], select[name='ownersBarangay']").attr('disabled', true);
    }

    var _formatDate = function(date) {
        var start   = date.split("/");
        var s       = new Date(start[2], (start[0] - 1), start[1]).toString();
        s = s.split(" ");
        return s[1] + ". " + s[2] + ", " + s[3];
    }

    var _initValidation = function () {
        // Step 1
        _validations.push(FormValidation.formValidation(
            _formEl,
            {
                fields: {
                    businessName: {
                        validators: {
                            notEmpty: {
                                message: 'Business name is required'
                            }
                        }
                    },
                    bussEmail: {
                        validators: {
                            notEmpty: {
                                message: 'Email is required'
                            },
                            emailAddress: {
                                message: 'The value is not a valid email address'
                            }
                        }
                    },
                    bussPhone: {
                        validators: {
                            notEmpty: {
                                message: 'Phone number is required'
                            },
                            stringLength: {
                                min:10,
                                message: 'Mobile number is invalid'
                            }
                        }
                    },
                    businessBarangay: {
                        validators: {
                            notEmpty: {
                                message: 'Barangay is required'
                            }
                        }
                    },
                    bussTIN: {
                        validators: {
                            notEmpty: {
                                message: 'Business TIN is required'
                            },
                            stringLength: {
                                min:11,
                                message: 'TIN is invalid'
                            }
                        }
                    },
                    locationType: {
                        validators: {
                            choice: {
                                min:1,
                                message: 'Please select location type'
                            }
                        }
                    },
                    businessArea: {
                        validators: {
                            notEmpty: {
                                message: 'Floor Area is required'
                            }
                        }
                    },
                },
                /*plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }*/
            }
        ));

        // Step 2
        _validations.push(FormValidation.formValidation(
            _formEl,
            {
                fields: {
                    organizationType: {
                        validators: {
                            notEmpty: {
                                message: 'Business type is required'
                            }
                        }
                    },
                    businessSize: {
                        validators: {
                            notEmpty: {
                                message: 'Business Size is required'
                            }
                        }
                    },
                    contactLname: {
                        validators: {
                            notEmpty: {
                                message: 'Last name is required'
                            }
                        }
                    },
                    contactFname: {
                        validators: {
                            notEmpty: {
                                message: 'First name is required'
                            }
                        }
                    },
                    contactPhone :{
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            },
                            stringLength: {
                                min:10,
                                message: 'Mobile number is invalid'
                            }
                        }
                    },
                    ownerLname:{
                        validators: {
                            notEmpty: {
                                message: 'Last name is required'
                            }
                        }
                    },
                    ownerFname:{
                        validators: {
                            notEmpty: {
                                message: 'First name is required'
                            }
                        }
                    },
                    ownersPhone :{
                        validators: {
                            stringLength: {
                                min:10,
                                message: 'Mobile number is invalid'
                            }
                        }
                    },
                    ownersEmail: {
                        validators: {
                            emailAddress: {
                                message: 'The value is not a valid email address'
                            }
                        }
                    },
                    totalCabuyenoEmployee:{
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            }
                        }
                    },
                    totalFemaleEmployee:{
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            },
                            digits: {
                                message: 'Invalid input'
                            }
                        }
                    },
                    totalMaleEmployee:{
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            },
                            digits: {
                                message: 'Invalid input'
                            }
                        }
                    },
                    totalBuildingEmployee:{
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            }
                        }
                    }

                },
                /*plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }*/
            }
        ));

        // Step 3
        _validations.push(FormValidation.formValidation(
            _formEl,
            {
                fields: {
                    supportingID: {
                        validators: {
                            notEmpty: {
                                message: 'Choose Supporting ID to present'
                            }
                        }
                    },
                    supportBusinessID1: {
                        validators: {
                            notEmpty: {
                                message: 'Permit number is required'
                            }
                        }
                    },
                    supportDateRegistration1: {
                        validators: {
                            notEmpty: {
                                message: 'Date Registration is required'
                            }
                        }
                    },
                    supportExpiryDate1: {
                        validators: {
                            notEmpty: {
                                message: 'Expiration is required'
                            }
                        }
                    },
                    supportBusinessID2: {
                        validators: {
                            notEmpty: {
                                message: 'Permit number is required'
                            }
                        }
                    },
                    supportDateRegistration2: {
                        validators: {
                            notEmpty: {
                                message: 'Date Registration is required'
                            }
                        }
                    },
                    supportExpiryDate2: {
                        validators: {
                            notEmpty: {
                                message: 'Expiration is required'
                            }
                        }
                    }

                },
                /*plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }*/
            }
        ));

        // Step 4 - Dead
        _validations.push(FormValidation.formValidation(
            _formEl,
            {
                fields: {
                    asd: {
                        validators: {
                            notEmpty: {
                                message: 'Organization type is required'
                            }
                        }
                    }
                },
                /*plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }*/
            }
        ));

        // Step 5 - Dead
        _validations.push(FormValidation.formValidation(
            _formEl,
            {
                fields: {
                    asd: {
                        validators: {
                            notEmpty: {
                                message: 'Organization type is required'
                            }
                        }
                    }
                },
                /*plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }*/
            }
        ));
        
        //Submit Application
        $("#btn_submit_application").on('click', function(e) {
            e.preventDefault();

            bussFiles = new Array();
            $("form#form_renew input[type='file']").each(function(){
                if( $(this).val() != "") {
                    var data = {
                        "req_id"   : $(this).attr("id"),
                        'req_name' : $(this).attr('name')
                    }
                    bussFiles.push(data);
                }
            });

            Swal.fire({
                title: "Confirmation",
                html: submitMsg(),
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
                    var fd = new FormData($("#form_renew")[0]);
                    fd.append('bussFiles', JSON.stringify(bussFiles));
                    fd.append('bussLines', JSON.stringify(bussLines));
                    fd.append('generated_id', GenID);
                    $.ajax({
                        url : create_renew_app_url,
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
                        success:function(res)
                        {
                            if(typeof res != 'string') {
                                bussLines    = new Array();
                                bussFiles    = new Array();
                                boardMembers = new Array();
                                forSwal("Successfully Saved", "success", "btn-success");
                                $("#form_renew")[0].reset();
                                $(".text-label").text("");
                                Swal.fire({
                                    title: "Successfully save",
                                    text: "Application is now ready to print!",
                                    icon: "success",
                                    showCancelButton: true,
                                    confirmButtonText: "<i class='la la-print'></i> Print",
                                    cancelButtonText: "<i class='la la-plus-square'></i> Make Another",
                                    reverseButtons: true
                                }).then(function(result) {
                                    if (result.value) {
                                        window.open('/bplo/print-application/' + res[1]);
                                        location.reload();
                                    } else if (result.dismiss === "cancel") {
                                        location.reload();
                                    }
                                });
                            }
                            else {
                                forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
                            }
                        },
                        error:function(a,b,c)
                        {
                            forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
                        }
                    });
                }
            });
        });

        var submitMsg = function () {
            var bussName = $("input[name='businessName']").val();
            var msg = "<div class='form-group mb-5'>\
                        <span class='font-weight-bolder'>Are you sure, you want to create this application?</span>\
                    </div>\
                    <div class='form-group row p-0 m-0'>\
                        <label class='col-5 text-right'> <span class='font-size-sm'> Application Type </span> : </label>\
                        <div class='col-7 text-left mb-3'>\
                            <span class='font-weight-bolder font-size-sm'>Renew Business</span>\
                        </div>\
                    </div>\
                    <div class='form-group row p-0 m-0'>\
                        <label class='col-5 text-right'> <span class='font-size-sm'>Business Name </span> : </label>\
                        <div class='col-7 text-left'>\
                            <span class='font-weight-bolder font-size-sm'>"+ bussName +"</span>\
                        </div>\
                    </div>";
            return msg;
        }
    }

    var _initWizard = function () {
        _wizard = new KTWizard(_wizardEl, {
            startStep: 1,
            clickableSteps: false
        });

        _wizard.on('beforeNext', function (wizard) {
            _wizard.stop();

            var validator = _validations[wizard.getStep() - 1];
            validator.validate().then(function (status) {
                
                if (status == 'Valid') 
                {
                    var isDisplay = false;
                    if (_wizard.getStep() == 1) {
                        var locType = $("input[name='locationType']:checked").val();
                        if( locType != "Owned") { 
                            var status1 = true;
                            if( locType == "Rent" ) {
                                var leaseOwner = $("select[name='leasingOwner']").val();
                                if ($("input[name='leaseAmount']").val() == "" ) {
                                    $("input[name='leaseAmount']").addClass('is-invalid');
                                    status1 = false;
                                }
                                if ($("textarea[name='lessorsAddress']").val() == "" ) {
                                    $("textarea[name='lessorsAddress']").addClass('is-invalid');
                                    status1 = false;
                                }
                                if( leaseOwner == "Personal" )
                                {
                                    if ($("input[name='lessorsLname']").val() == "" ) {
                                        $("input[name='lessorsLname']").addClass('is-invalid');
                                        status1 = false;
                                    }
                                    if ($("input[name='lessorsFname']").val() == "" ) {
                                        $("input[name='lessorsFname']").addClass('is-invalid');
                                        status1 = false;
                                    }
                                }
                                else {
                                    if ($("input[name='lessorsCname']").val() == "" ) {
                                        $("input[name='lessorsCname']").addClass('is-invalid');
                                        status1 = false;
                                    }
                                }
                            } else {
                               if ($("textarea[name='leaseAgreement']").val() == "" ) {
                                    $("textarea[name='leaseAgreement']").addClass('is-invalid');
                                    status1 = false;
                                } 
                            }
                            if( status1 ) {
                                _wizard.goNext();
                                _toggleNav(_wizard.getStep());
                            } else {
                                Swal.fire({
                                    text: "Sorry, looks like there are some errors detected, please try again.",
                                    icon: "error",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it!",
                                    customClass: {
                                        confirmButton: "btn font-weight-bold btn-light"
                                    }
                                })
                            }
                        }
                        else {
                            _wizard.goNext();
                            _toggleNav(_wizard.getStep());
                        }
                    } else if (_wizard.getStep() == 2) {
                        var total = $("input[name='totalBuildingEmployee']").val();
                        if (total == "" || total == 0) {
                            Swal.fire({
                                title: "Warning",
                                html: "Total Employee is zero. Are you sure you want to proceed?",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: "Yes, please!",
                                cancelButtonText: "No, cancel!",
                                customClass: {
                                   confirmButton: "btn btn-primary mt-0"
                                },
                                reverseButtons: true
                            }).then(function(result) {
                                if (result.value) {
                                    _wizard.goNext();
                                    _toggleNav(_wizard.getStep());
                                }
                            });
                        } else {
                            _wizard.goNext();
                            _toggleNav(_wizard.getStep());
                        }
                    } else if ( _wizard.getStep() == 3 ) {
                       _wizard.goNext();
                        _toggleNav(_wizard.getStep());
                    } else if ( _wizard.getStep() == 4 ) {
                        _wizard.goNext();
                        _toggleNav(_wizard.getStep());
                    } else if ( _wizard.getStep() == 5 ) {
                        var hasFiles = false;
                        $("form#form_renew input[type='file']").each(function(){
                            if( $(this).val() != "") {
                                hasFiles = true;
                                return false;
                            } else {
                                hasFiles = false;
                            }
                        });
                        if (!hasFiles) {
                            Swal.fire({
                                title: "Warning!",
                                text: "You have no selected files to upload. Are you sure you want to proceed?",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: "Yes, please",
                                cancelButtonText: "No, I'll select",
                                customClass: {
                                   confirmButton: "btn btn-primary mt-0"
                                },
                                reverseButtons: true
                            }).then(function(result) {
                                if (result.value) {
                                    _wizard.goNext();
                                    _toggleNav(_wizard.getStep());
                                    _displayData();
                                }
                            });
                        } else {
                            _wizard.goNext();
                            _toggleNav(_wizard.getStep());
                            _displayData();
                        }
                    } 
                    //KTUtil.scrollTop();
                } 
                else 
                {
                    Swal.fire({
                        text: "Sorry, looks like there are some errors detected, please try again.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn font-weight-bold btn-light"
                        }
                    })
                }
                
            });
        });

        // Change event
        _wizard.on('change', function (wizard) {
            var step = _wizard.getStep();
            var svgs = [
                '',
                '<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect x="0" y="0" width="24" height="24"/><path d="M13.5,21 L13.5,18 C13.5,17.4477153 13.0522847,17 12.5,17 L11.5,17 C10.9477153,17 10.5,17.4477153 10.5,18 L10.5,21 L5,21 L5,4 C5,2.8954305 5.8954305,2 7,2 L17,2 C18.1045695,2 19,2.8954305 19,4 L19,21 L13.5,21 Z M9,4 C8.44771525,4 8,4.44771525 8,5 L8,6 C8,6.55228475 8.44771525,7 9,7 L10,7 C10.5522847,7 11,6.55228475 11,6 L11,5 C11,4.44771525 10.5522847,4 10,4 L9,4 Z M14,4 C13.4477153,4 13,4.44771525 13,5 L13,6 C13,6.55228475 13.4477153,7 14,7 L15,7 C15.5522847,7 16,6.55228475 16,6 L16,5 C16,4.44771525 15.5522847,4 15,4 L14,4 Z M9,8 C8.44771525,8 8,8.44771525 8,9 L8,10 C8,10.5522847 8.44771525,11 9,11 L10,11 C10.5522847,11 11,10.5522847 11,10 L11,9 C11,8.44771525 10.5522847,8 10,8 L9,8 Z M9,12 C8.44771525,12 8,12.4477153 8,13 L8,14 C8,14.5522847 8.44771525,15 9,15 L10,15 C10.5522847,15 11,14.5522847 11,14 L11,13 C11,12.4477153 10.5522847,12 10,12 L9,12 Z M14,12 C13.4477153,12 13,12.4477153 13,13 L13,14 C13,14.5522847 13.4477153,15 14,15 L15,15 C15.5522847,15 16,14.5522847 16,14 L16,13 C16,12.4477153 15.5522847,12 15,12 L14,12 Z" fill="#000000"/><rect fill="#FFFFFF" x="13" y="8" width="3" height="3" rx="1"/><path d="M4,21 L20,21 C20.5522847,21 21,21.4477153 21,22 L21,22.4 C21,22.7313708 20.7313708,23 20.4,23 L3.6,23 C3.26862915,23 3,22.7313708 3,22.4 L3,22 C3,21.4477153 3.44771525,21 4,21 Z" fill="#000000" opacity="0.3"/></g></svg>',
                '<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><polygon points="0 0 24 0 24 24 0 24"/><path d="M18,14 C16.3431458,14 15,12.6568542 15,11 C15,9.34314575 16.3431458,8 18,8 C19.6568542,8 21,9.34314575 21,11 C21,12.6568542 19.6568542,14 18,14 Z M9,11 C6.790861,11 5,9.209139 5,7 C5,4.790861 6.790861,3 9,3 C11.209139,3 13,4.790861 13,7 C13,9.209139 11.209139,11 9,11 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"/><path d="M17.6011961,15.0006174 C21.0077043,15.0378534 23.7891749,16.7601418 23.9984937,20.4 C24.0069246,20.5466056 23.9984937,21 23.4559499,21 L19.6,21 C19.6,18.7490654 18.8562935,16.6718327 17.6011961,15.0006174 Z M0.00065168429,20.1992055 C0.388258525,15.4265159 4.26191235,13 8.98334134,13 C13.7712164,13 17.7048837,15.2931929 17.9979143,20.2 C18.0095879,20.3954741 17.9979143,21 17.2466999,21 C13.541124,21 8.03472472,21 0.727502227,21 C0.476712155,21 -0.0204617505,20.45918 0.00065168429,20.1992055 Z" fill="#000000" fill-rule="nonzero"/></g></svg>',
                '<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect x="0" y="0" width="24" height="24"/><path d="M14,16 L12,16 L12,12.5 C12,11.6715729 11.3284271,11 10.5,11 C9.67157288,11 9,11.6715729 9,12.5 L9,17.5 C9,19.4329966 10.5670034,21 12.5,21 C14.4329966,21 16,19.4329966 16,17.5 L16,7.5 C16,5.56700338 14.4329966,4 12.5,4 L12,4 C10.3431458,4 9,5.34314575 9,7 L7,7 C7,4.23857625 9.23857625,2 12,2 L12.5,2 C15.5375661,2 18,4.46243388 18,7.5 L18,17.5 C18,20.5375661 15.5375661,23 12.5,23 C9.46243388,23 7,20.5375661 7,17.5 L7,12.5 C7,10.5670034 8.56700338,9 10.5,9 C12.4329966,9 14,10.5670034 14,12.5 L14,16 Z" fill="#000000" fill-rule="nonzero" transform="translate(12.500000, 12.500000) rotate(-315.000000) translate(-12.500000, -12.500000) "/></g></svg>',
                '<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect x="0" y="0" width="24" height="24"/><path d="M10,4 L21,4 C21.5522847,4 22,4.44771525 22,5 L22,7 C22,7.55228475 21.5522847,8 21,8 L10,8 C9.44771525,8 9,7.55228475 9,7 L9,5 C9,4.44771525 9.44771525,4 10,4 Z M10,10 L21,10 C21.5522847,10 22,10.4477153 22,11 L22,13 C22,13.5522847 21.5522847,14 21,14 L10,14 C9.44771525,14 9,13.5522847 9,13 L9,11 C9,10.4477153 9.44771525,10 10,10 Z M10,16 L21,16 C21.5522847,16 22,16.4477153 22,17 L22,19 C22,19.5522847 21.5522847,20 21,20 L10,20 C9.44771525,20 9,19.5522847 9,19 L9,17 C9,16.4477153 9.44771525,16 10,16 Z" fill="#000000"/><rect fill="#000000" opacity="0.3" x="2" y="4" width="5" height="16" rx="1"/></g></svg>',
                '<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><polygon points="0 0 24 0 24 24 0 24"/><path d="M5.85714286,2 L13.7364114,2 C14.0910962,2 14.4343066,2.12568431 14.7051108,2.35473959 L19.4686994,6.3839416 C19.8056532,6.66894833 20,7.08787823 20,7.52920201 L20,20.0833333 C20,21.8738751 19.9795521,22 18.1428571,22 L5.85714286,22 C4.02044787,22 4,21.8738751 4,20.0833333 L4,3.91666667 C4,2.12612489 4.02044787,2 5.85714286,2 Z M10.875,15.75 C11.1145833,15.75 11.3541667,15.6541667 11.5458333,15.4625 L15.3791667,11.6291667 C15.7625,11.2458333 15.7625,10.6708333 15.3791667,10.2875 C14.9958333,9.90416667 14.4208333,9.90416667 14.0375,10.2875 L10.875,13.45 L9.62916667,12.2041667 C9.29375,11.8208333 8.67083333,11.8208333 8.2875,12.2041667 C7.90416667,12.5875 7.90416667,13.1625 8.2875,13.5458333 L10.2041667,15.4625 C10.3958333,15.6541667 10.6354167,15.75 10.875,15.75 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"/><path d="M10.875,15.75 C10.6354167,15.75 10.3958333,15.6541667 10.2041667,15.4625 L8.2875,13.5458333 C7.90416667,13.1625 7.90416667,12.5875 8.2875,12.2041667 C8.67083333,11.8208333 9.29375,11.8208333 9.62916667,12.2041667 L10.875,13.45 L14.0375,10.2875 C14.4208333,9.90416667 14.9958333,9.90416667 15.3791667,10.2875 C15.7625,10.6708333 15.7625,11.2458333 15.3791667,11.6291667 L11.5458333,15.4625 C11.3541667,15.6541667 11.1145833,15.75 10.875,15.75 Z" fill="#000000"/></g></svg>',
                '<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect x="0" y="0" width="24" height="24"/><path d="M9,10 L9,19 L10.1525987,19.3841996 C11.3761964,19.7920655 12.6575468,20 13.9473319,20 L17.5405883,20 C18.9706314,20 20.2018758,18.990621 20.4823303,17.5883484 L21.231529,13.8423552 C21.5564648,12.217676 20.5028146,10.6372006 18.8781353,10.3122648 C18.6189212,10.260422 18.353992,10.2430672 18.0902299,10.2606513 L14.5,10.5 L14.8641964,6.49383981 C14.9326895,5.74041495 14.3774427,5.07411874 13.6240179,5.00562558 C13.5827848,5.00187712 13.5414031,5 13.5,5 L13.5,5 C12.5694044,5 11.7070439,5.48826024 11.2282564,6.28623939 L9,10 Z" fill="#000000"/><rect fill="#000000" opacity="0.3" x="2" y="9" width="5" height="11" rx="1"/></g></svg>'
            ];
            $("#iconStep"+ step).html("");
            $("#iconStep"+ step).removeClass("svg-icon-white bg-success text-center done");
            $("#iconStep"+ step).html(svgs[step]);
        });
    }

    var _toggleNav = function(step) {
        $("#iconStep"+ (step - 1)).html("");
        $("#iconStep"+ (step - 1)).addClass("svg-icon-white bg-success text-center done");
        $("#iconStep"+ (step - 1)).html('<svg width="10px" height="10px" style="margin-top:-20px;" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><polygon points="0 0 24 0 24 24 0 24"/><path d="M6.26193932,17.6476484 C5.90425297,18.0684559 5.27315905,18.1196257 4.85235158,17.7619393 C4.43154411,17.404253 4.38037434,16.773159 4.73806068,16.3523516 L13.2380607,6.35235158 C13.6013618,5.92493855 14.2451015,5.87991302 14.6643638,6.25259068 L19.1643638,10.2525907 C19.5771466,10.6195087 19.6143273,11.2515811 19.2474093,11.6643638 C18.8804913,12.0771466 18.2484189,12.1143273 17.8356362,11.7474093 L14.0997854,8.42665306 L6.26193932,17.6476484 Z" fill="#000000" fill-rule="nonzero" transform="translate(11.999995, 12.000002) rotate(-180.000000) translate(-11.999995, -12.000002) "/></g></svg>');
    }

    var _displayData = function() {
        var bussLineOutput = "";
        var boardsOutput   = "";

        //Boards
        if( $("select[name='organizationType']").val() != 5 ) {
            boardsOutput += '<div class="col-lg-12 mt-5"><h6 class="text-primary font-weight-bolder">Board members</h6></div>';
            boardsOutput += '<div class="col-lg-3 text-right"><span class="text-muted font-weight-bolder font-size-md mr-2">Board Members:</span></div>';
            boardsOutput += '<div class="col-lg-7">&nbsp;</div>';
            if( boardMembers.length > 0) {
                $.each(boardMembers, function(index, value){
                    boardsOutput += '<div class="col-lg-3 text-right">Last name</div>';
                    boardsOutput += '<div class="col-lg-7"><span class="text-dark text-label font-size-md font-weight-bold" id="'+value.boardLName+'">--</span></div>';
                    boardsOutput += '<div class="col-lg-3 text-right">First name</div>';
                    boardsOutput += '<div class="col-lg-7"><span class="text-dark text-label font-size-md font-weight-bold" id="'+value.boardFName+'">--</span></div>';
                    boardsOutput += '<div class="col-lg-3 text-right">Middle name</div>';
                    boardsOutput += '<div class="col-lg-7"><span class="text-dark text-label font-size-md font-weight-bold" id="'+value.boardMName+'">--</span></div>';
                    boardsOutput += '<div class="col-lg-3 text-right">Contact</div>';
                    boardsOutput += '<div class="col-lg-7 mb-5"><span class="text-dark text-label font-size-md font-weight-bold" id="'+value.boardPhone+'">--</span></div>';
                });
            } else {
                boardsOutput += '<div class="col-lg-12 text-center text-danger"><span class="text-muted font-weight-bolder font-size-md text-danger">No board members</span>';
            }

            $("#divBoardsResult").empty();
            $('#divBoardsResult').append(boardsOutput);
            $("#divBoardsResult").show(0);
        } else {
            $("#divBoardsResult").empty();
            $("#divBoardsResult").hide(0);
        }

        //Buss Lines
        $.each(bussLines, function(index, item){
            bussLineOutput += '<span class="label label-xl label-success label-pill label-inline mr-2 p-10 font-weight-bolder">' + item.bussLineDesc +  '</span>';
        });
        $('#businessLines').empty();
        $('#businessLines').append(bussLineOutput);

        //Location Type
        var locType = $("input[name='locationType']:checked").val();
        if( locType == "Rent" ) {
            $(".divAgreementResult").hide(0);
            $(".divRentResult").show(0);
            if($("select[name='leasingOwner']").val() == "Personal") {
                $(".divRentCompany").hide(0);
                $(".divRentPerson").show(0);
            } else {
                $(".divRentPerson").hide(0);
                $(".divRentCompany").show(0);
            }
        } else if ( locType == "Others" ) {
            $(".divRentResult").hide(0);
            $(".divAgreementResult").show(0);
        } else {
            $(".divRentResult").hide(0);
            $(".divAgreementResult").hide(0);
        }

        //Display Data
        for (var i = 0; i < $("#form_renew")[0].length; i++) {
            var formType = $("#form_renew")[0][i].type;
            var formVal  = $("#form_renew")[0][i].value;
            var formName = $("#form_renew")[0][i].name;
            //console.log(formName + " - " + formVal);
            if( formType != "search" && formType != "button") {
                if( formType == "checkbox" ) {
                    if( $("input[name='"+formName+"']").is(":checked") ) {
                        $("#" + formName).prop("checked", true);
                    } else {
                        $("#" + formName).prop("checked", false);
                    }
                }
                else 
                {
                    if(formVal != '') {
                        if(formName == "locationType") {
                            $("#" + formName).text( $("input[name='locationType']:checked").val() );
                        }
                        else if(formName == "isBranch") {
                            $("#" + formName).text( $("select[name='isBranch'] option:selected").text());
                        }
                        else if(formName == "organizationType") {
                            $("#" + formName).text( $("select[name='organizationType'] option:selected").text());
                        }
                        else if(formName == "businessSize") {
                            $("#" + formName).text( $("select[name='businessSize'] option:selected").text());
                        }
                        else if(formName == "sec_date"   || 
                                formName == "sec_expiry" || 
                                formName == "dti_date"   || 
                                formName == "dti_expiry" || 
                                formName == "cda_date"   ||
                                formName == "cda_expiry" ||
                                formName == "sss_date"   ||
                                formName == "sss_expiry" ||
                                formName == "bc_date"    ||
                                formName == "bc_expiry"  ||
                                formName == "peza_date"  ||
                                formName == "peza_expiry") {
                            var date = new Date(formVal);
                            var newDate = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
                            $("#" + formName).text( _formatDate(newDate) );
                        }
                        else {
                            $("#" + formName).text(formVal);
                        }
                    }
                    else {
                        $("#" + formName).text('--');
                    }
                }
            }
        }
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
            bLengthChange: false,
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
            _wizardEl = KTUtil.getById('kt_wizard');
            _formEl   = KTUtil.getById('form_renew');

            _initWizard();
            _initValidation();
            _onLoad();
            //_loadBusinessLine();
        }
    };

}();

// Initialization
jQuery(document).ready(function() {
    KTRenewApplication.init();
});