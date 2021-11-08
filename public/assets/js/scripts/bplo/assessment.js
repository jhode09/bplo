"use strict";
// Class definition
menuActive('li-menu-bplo', 'li-submenu-bplo-assessment');
$("#notifDot").hide(0);
$("#notifBtn").removeClass("pulse pulse-white");

var table1, table2;
var AssessID, GenID, BussClassID, TaxID;
var IsRenewal     = false;
var IsCorporation = false;
var GrossArray    = new Array();

var TotalGross        = 0;
var TotalMayorsFee    = 0;
var TotalOthersFee    = 0;
var TotalTaxAmount    = 0;
var TotalPenalty      = 0;
var TotalAssessment   = 0;
var TotalFire         = 0;
var TotalCommunityTax = 0;
var TotalHealth       = 0;
var TotalPlates       = 0;
var TotalGarbageFee   = 0;


//Click Assess Now
var AssessNow = function(id, genID) {
    $.ajax({
        url : fetch_assessment_otherdetails_url,
        type: 'post',
        data: { 
            id    : id,
            genID : genID
        },
        dataType: 'json',
        success: function (res) {
            ResetTotals();
            AssessID = id;
            GenID    = genID;
            var status = {
                1: {'title': 'Closing', 'class': 'label-light-danger'},
                2: {'title': 'Re-assessment', 'class': ' label-light-primary'},
                3: {'title': 'New', 'class': ' label-light-info'},
                4: {'title': 'Renewal', 'class': ' label-light-warning'},
                5: {'title': 'Special Permit', 'class': ' label-light-primary'},
            };
            $("#AssessEntry").prop('hidden', false);
            $("#MainEntry").prop('hidden', true);
            $("#assessBussID").text(GenID);
            $("#assessBussName").text(res.assess.BussName);
            $("#assessBussBrgy").text(res.assess.Brgy);
            $("#assessBussProc").html('<span class="label ' + status[res.assess.Status].class + ' label-inline font-weight-bold label-lg">' + status[res.assess.Status].title + '</span>');
            
            $("#maleCount").val(res.emp.male_count);
            $("#femaleCount").val(res.emp.female_count);

            var table  = $("#tbl_bussLines tbody");
            var output = "";
             $.each(res.bussLines, function(index, value) {
                var desc = value.BussLine + " <br> <span class='text-muted'><small>" + value.BussCat + "</small></span>";
                output += "<tr>";
                output += "<td class='font-weight-bolder' width='400'>"+desc+"</td>";
                output += "<td class='text-right'>₱ "+AddComma(parseFloat(value.GrossAmount).toFixed(2))+"</td>";
                output += "<td class='text-center'><button class='btn btn-sm btn-clean btn-icon' onclick=UpdateGross('"+value.BussClassID+"','"+value.GrossAmount+"','"+value.TaxtableID+"')> <i class='flaticon-edit'></i> </button></td>";
                output += "</tr>";
            })
            table.empty();
            table.append(output);

            if (res.assess.Status == 4) {
                IsRenewal = true;
            } else {
                IsRenewal = false;
            }
        },
        error: function (a,b,c) {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    })
}

var UpdateGross = function(bussClassID, grossAmount, taxID) {
    $("#grossModal").modal('show');
    $("#bussGrossAmount").val(grossAmount).focus();
    BussClassID = bussClassID;
    TaxID = taxID;
} 

var CloseGross = function() {
    BussClassID = "";
    $("#bussGrossAmount").val('');
}

var SaveGross = function() {
    if (IsRenewal) {
        if ($("#bussGrossAmount").val().replace('₱ ', '').replace(',', '') != 0) {
            SubmitGross();
        } else {
            forSwal("Invalid Gross", "error", "btn-danger");
        }
    } else {
        SubmitGross();
    }
}

var SubmitGross = function() {
    var btn  = KTUtil.getById("btnSaveGross");
    $.ajax({
        url : save_gross_url,
        data: {
            assessID    : AssessID,
            bussClassID : BussClassID,
            taxID       : TaxID,
            grossAmount : $("#bussGrossAmount").val()
        },
        type: "post",
        beforeSend: function() {
            KTUtil.btnWait(btn, "spinner spinner-left spinner-darker-success pl-15");
        },
        complete: function() {
            KTUtil.btnRelease(btn);
            $("#grossModal").modal('hide');
        },
        success:function(res) {
            res = res.trim();
            if(res == "success") {
                $("#bussGrossAmount").val('');
                AssessNow(AssessID, GenID);
            }
        }
    })
}

var CancelAssess = function() {
    $("#MainEntry").prop('hidden', false);
    $("#AssessEntry").prop('hidden', true);
}

var ViewDetails = function(id) {
    $.ajax({
        url: view_details_url,
        type: "post",
        data: {"id": id},
        success:function(res) {  
            $('#modalViewDetails').modal('show');
           
            $('#buss_name').text(res.business.buss_name);
            $('#generated_id').text(res.business.generated_id);
            $('#buss_email').text(res.business.buss_email);
            $('#buss_phone').text(res.business.buss_phone);
            $('#buss_addr').text(res.business.buss_addr);
            $('#buss_brgy').text("Brgy. "+ res.business.buss_brgy);
            $('#franchise_name').text(res.business.franchise_name);
            $('#business_type').text(res.business.buss_type);
            $('#female_count').text(res.business.female_count);
            $('#male_count').text(res.business.male_count);
            var female = parseInt($('#female_count').text());
            var male = parseInt($('#male_count').text());
            var emp_count = female + male;
            $('#employee_count').text(emp_count);
            $('#business_size').text(res.business.buss_size);
            $('#app_date').text(moment(res.business.appli_date).format("MMMM D YYYY, h:mm:ss a"));
            $('#assess_date').text(moment(res.business.assess_date).format("MMMM D YYYY, h:mm:ss a"));


            var is_branch = (res.business.is_branch == 1) ? "Yes" : "No";
            $('#is_branch').text(is_branch);
            $('#floor_area').text(res.business.floor_area + " sqm.");





            if (res.business.location_type == 0){
                $('#location_type').text("Owned");                
            }else if(res.business.location_type == 1){
                $('#location_type').text("Rent");
                 $("#renting_details").html(`
                    <div class="col-6">
                        <span class="text-muted">Leasing Owner:</span>
                    </div>
                    <div class="col-6">
                        <span class="text-dark font-weight-bolder">--</span>
                    </div>
                    <div class="col-6">
                        <span class="text-muted">Lease Amount per month:</span>
                    </div>
                    <div class="col-6">
                        <span class="text-dark font-weight-bolder">--</span>
                    </div>
                    <div class="col-6">
                        <span class="text-muted">Lessor Name:</span>
                    </div>
                    <div class="col-6">
                        <span class="text-dark font-weight-bolder">--</span>
                    </div>
                    <div class="col-6">
                        <span class="text-muted">Contact No.:</span>
                    </div>
                    <div class="col-6">
                        <span class="text-dark font-weight-bolder">--</span>
                    </div>
                    <div class="col-6">
                        <span class="text-muted">Email Address:</span>
                    </div>
                    <div class="col-6">
                        <span class="text-dark font-weight-bolder">--</span>
                    </div>
                `);
            }else{
                var agreement_type = (res.businessagreement.agreement_type == 1) ? "Memorandum of Agreement" : "Written of Prop. Owner";
                $('#location_type').text("Others");
                $("#agreement_details").html(`
                    <div class="col-6">
                        <span class="text-muted">Agreement Type:</span>
                    </div>
                    <div class="col-6">
                        <span>`+agreement_type+`</span>
                    </div>
                    <div class="col-6">
                        <span class="text-muted">Agreement Description:</span>
                    </div>
                    <div class="col-6">
                        <span>`+res.businessagreement.agreement_desc+`</span>
                    </div>

                `);
            }

            var ol = $('#businesslines');
            var li = "";
            $.each(res.busslines, function(index, value){
                li += `<li>`+ value.bussline_desc +`</li>`;
            });
            ol.empty();
            ol.append(li);

            var table = $('#tblbuss_mem tbody');
            var tr = "";
            $.each(res.buss_members, function(index, value){
                tr += `<tr>
                            <td>`+ value.fname + " " + value.lname + `</td>
                            <td>`+ value.member_type +`</td>
                            <td>`+ value.contact +`</td>
                      </tr>`

                ;
            });
            table.empty();
            table.append(tr);

               


        },
        error:function(a,b,c)
        {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    })
}



var ProceedToTOP = function() {
    //$("#modalOtherDetails").modal('hide');
    $("#modalTOP").modal('hide');
    $.ajax({
        url : fetch_assessment_details_url,
        type: 'post',
        data: { 
            id    : AssessID,
            genID : GenID
        },
        dataType: 'json',
        beforeSend : function() {
            _beforeSend();
        },
        complete : function() {
            _complete();
        },
        success: function (res) {
            ResetTotals();
            DisplayTOP(res);
        },
        error: function (a,b,c) {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    })
}

var DisplayTOP = function (res) {

    //Begin Top Details
        var status = {
            1: {'title': 'Closing', 'class': 'label-light-danger'},
            2: {'title': 'Re-assessment', 'class': ' label-light-primary'},
            3: {'title': 'New', 'class': ' label-light-info'},
            4: {'title': 'Renew', 'class': ' label-light-success'},
            5: {'title': 'Special Permit', 'class': ' label-light-primary'},
        };

        var bussAddr = "";
        if (res.assess.House) {
            bussAddr += res.assess.House + ", ";
        }

        if (res.assess.Bldg) {
            bussAddr += res.assess.Bldg + ", ";
        }

        if (res.assess.Street) {
            bussAddr += res.assess.Street + ", ";
        }

        if (res.assess.Brgy) {
            bussAddr += "Brgy. " + res.assess.Brgy;
        }

        $("#spanOwner").text(res.owner.lname + " " + res.owner.fname + ", " + res.owner.mname);
        $("#spanBussName").text(res.assess.BussName);
        $("#spanBussAddr").text(bussAddr);
        $("#spanOwnership").text(res.assess.BussType);
        $("#spanStatus").text(status[res.assess.Status].title);
        $("#spanProcessingDate").text(res.date);
    //End Top Details

    var table  = $("#tbl_top tbody");
    var output = "";
    
    //Begin Business Tax
        var hasBussTax = true;
        $.each(res.bussLines[0], function(index, value) {
            var title = "Business Tax - " + value.BussLine;
            var taxAmount = 0;
            if (value.GrossAmount != 0) {
                hasBussTax = true;
                return false;
            } else {
                hasBussTax = false;
            }
        })

        if (hasBussTax) {
            var payFreq    = $("#paymentFreq").val();
            var displayQtr = "";
            if (payFreq == 1) {
                displayQtr = "1234";
            } else if (payFreq == 2) {
                displayQtr = "1 2";
            } else {
                displayQtr = "1";
            }

            $.each(res.bussLines[0], function(index, value) {
                var title = "Business Tax - " + value.BussLine;
                var taxAmount = 0;
                if (value.GrossAmount != 0) {
                    taxAmount = value.AmountDue;
                    TotalPenalty += ComputePenalty(taxAmount);
                    output += MakeRow(title, parseFloat(value.GrossAmount), parseFloat(taxAmount + TotalPenalty), parseFloat(taxAmount), displayQtr, TotalPenalty);
                } else {
                    output += MakeRow(title, parseFloat(value.GrossAmount), parseFloat(taxAmount), parseFloat(taxAmount));
                }
                TotalGross += value.GrossAmount;
                TotalTaxAmount += parseFloat(taxAmount);
            })
        }
    //End Business Tax

    //Begin Mayors Permit
        var mayorsFee = 0;
        $.each(res.bussLines[1], function(index, value) {
            var title = "Mayor's Permit - " +  value.BussLine;
            output += MakeRow(title, 0, value.Amount, value.Amount);
            mayorsFee += value.Amount;
        })
    //End Mayors Permit

    //Begin Garbage
        TotalGarbageFee = res.garbage;
        output += MakeRow("Garbage Fee", 0, res.garbage, res.garbage);
    //End Garbage

    //Begin Sanitary
        if ( res.sanitary ) {
            output += MakeRow("Sanitary Fee", 0, res.sanitary.SanitaryFee, res.sanitary.SanitaryFee);
        }
    //End Sanitary

    //Begin Health
        var totalEmp = parseInt($("#maleCount").val()) + parseInt($("#femaleCount").val());
        var health   = totalEmp * 100;
        TotalHealth  = health
        output += MakeRow("Health Certificate (Health Office)", 0, health, health);
    //End Health

    //Begin Building
        if ( res.building ) {
            if ( res.building.InspectionFee ) {
                output += MakeRow("Building Inspection Fee", 0, res.building.InspectionFee, res.building.InspectionFee);
            }

            if ( res.building.Mechanical ) {
                output += MakeRow("Mechanical Fee", 0, res.building.Mechanical, res.building.Mechanical);
            }

            if ( res.building.Electrical ) {
                output += MakeRow("Electrical Fee", 0, res.building.Electrical, res.building.Electrical);
            }

            if ( res.building.Plumbing ) {
                output += MakeRow("Plumbing Fee", 0, res.building.Plumbing, res.building.Plumbing);
            }

            if ( res.building.SignBoard ) {
                output += MakeRow("Signboard/Advertisment", 0, res.building.SignBoard, res.building.SignBoard);
            }
        }
    //End Building

    //Begin Plates
        var plates = 0;
        if(IsRenewal) {
            plates = 10;
        } else {
            plates = 200;
        }
        TotalPlates = plates;
        output += MakeRow("Registration Plates, Tags and Sticker Fee", 0, plates, plates);
    //End Plates

    //Begin Cenro
        //
        output += MakeRow("Environmental Fee", 0, res.cenro.EnvironmentalFee, res.cenro.EnvironmentalFee);
    //End Cenro

    //Begin Building - Electronics
        if ( res.building.Electronics ) {
            output += MakeRow("Electronics Fee", 0, res.building.Electronics, res.building.Electronics);
        }
    //End Building - Electronics

    TotalMayorsFee = mayorsFee;
    TotalOthersFee = (res.total + plates + health);

    //Begin Total Assess
        var totalAsses  = (res.total + health + plates + TotalTaxAmount + TotalPenalty);
        TotalAssessment = totalAsses;
        $("#totalAssess").text("₱ " + AddComma(totalAsses.toFixed(2)));
    //End Total Assess

    //Begin Total Fire
        var totalFire = ((res.total + plates + health) * 0.15);
        TotalFire     = totalFire;
        $("#totalFire").text(AddComma(totalFire.toFixed(2)));
    //End Total Fire

    //Begin Total Community Tax
        var totalCommunityTax = 0;
        var IsCorporation = false
        var ownerShip = res.assess.BussType;
        var fixAmount = 0;
        var dividend  = 0;

        if ( ownerShip == "Single Ownership") {
            IsCorporation = false;
            fixAmount = 5;
            dividend  = 1000;
        } else {
            IsCorporation = true;
            fixAmount = 500;
            dividend  = 5000;
        }

        var totalBasis = TotalGross / dividend;
        var penaltySingle = [0.80, 1.00, 1.20, 1.40, 1.60, 1.80, 2.00, 2.20, 2.40];
        var penaltyCorp   = [40, 50, 60, 70, 80, 90, 100, 110, 120];
        var penaltyBasis;

        if (IsCorporation) {
            if (totalBasis >= 10000) {
                totalCommunityTax = (10000 + fixAmount);
            } else {
                totalCommunityTax = ((totalBasis * 2) + fixAmount);
            }
            penaltyBasis = penaltyCorp;
        } else {
            if (totalBasis >= 5000) {
                totalCommunityTax = (5000 + fixAmount);
            } else {
                totalCommunityTax = ((totalBasis * 1) + fixAmount);
            }
            penaltyBasis = penaltySingle;
        }

        //Cedula Penalty
        var d = new Date();
        var month = d.getMonth() + 1;
        if ( month == 4 ) {
            totalCommunityTax += penaltyBasis[0];
        } else if ( month == 5 ) {
            totalCommunityTax += penaltyBasis[1];
        } else if ( month == 6 ) {
            totalCommunityTax += penaltyBasis[2];
        } else if ( month == 7 ) {
            totalCommunityTax += penaltyBasis[3];
        } else if ( month == 8 ) {
            totalCommunityTax += penaltyBasis[4];
        } else if ( month == 9 ) {
            totalCommunityTax += penaltyBasis[5];
        } else if ( month == 10 ) {
            totalCommunityTax += penaltyBasis[6];
        } else if ( month == 11 ) {
            totalCommunityTax += penaltyBasis[7];
        } else {
            totalCommunityTax += penaltyBasis[8];
        }

        TotalCommunityTax = totalCommunityTax;
        $("#totalCommunityTax").text(AddComma(totalCommunityTax.toFixed(2)));
    //End Total Community Tax

    //Begin Payment Freq
        if(TotalTaxAmount == 0) {

            $("#divPaymentFreq").hide(0);
        } else {
            var annual = TotalAssessment;
            $("#spanAnnualJan").text(AddComma(annual.toFixed(2)));

            var semiAnnual = (TotalTaxAmount * 0.5);
            var firstSemiAnnual = (semiAnnual + TotalOthersFee);
            $("#spanSemiAnnualJan").text(AddComma(firstSemiAnnual.toFixed(2)));
            $("#spanSemiAnnualJul").text(AddComma(semiAnnual.toFixed(2)));

            var qtr = (TotalTaxAmount * 0.25);
            var firstQtr = (qtr + TotalOthersFee);
            $("#spanQtrJan").text(AddComma(firstQtr.toFixed(2)));
            $("#spanQtrApr").text(AddComma(qtr.toFixed(2)));
            $("#spanQtrJul").text(AddComma(qtr.toFixed(2)));
            $("#spanQtrOct").text(AddComma(qtr.toFixed(2)));
            $("#divPaymentFreq").show(0);
        }
    //End Payment Freq
    
    table.empty();
    table.append(output);

    $("#modalTOP").modal('show');
}

var FetchTaxAmount = function(taxID, gross) {
    var tax = 0;
    $.ajax({
        url : fetch_taxamount_url,
        type: 'post',
        data: { 
            taxID : taxID,
            gross : gross
        },
        async: false,
        success: function (res) {
            tax = res;
        },
        error: function (a,b,c) {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    })
    return tax;
}

var ComputePenalty = function(amountDue, lastDate = null, startDate = null) {
    var months;
    var d  = new Date();
    var d1 = new Date("01/21/"+d.getFullYear());
    var d2 = new Date();
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    if( months > 0 ) {
        var noOfMonths = months + 3;
        var noOfQtrs   = 0;
        if ( months >= 1 && months < 4) {
            noOfQtrs = 1;
        } else if ( months >= 4 && months < 7) {
            noOfQtrs = 2;
        } else if ( months >= 7  && months < 10) {
            noOfQtrs = 3;
        } else if ( months >= 10 ) {
            noOfQtrs = 4;
        }

        //Computation
        var qtrTaxDue = amountDue / 4;
        var surchage  = qtrTaxDue * 0.25;
        var subTotal1 = surchage * noOfQtrs;
        var interest  = (qtrTaxDue + surchage) * 0.02;
        var subTotal2 = interest * noOfMonths;
        var total = subTotal1 + subTotal2;
        return total;
    } else {
        return 0;
    }
}

var MakeRow = function (title, base = 0, total, amountDue = 0, qtr = "", penalty = 0) {
    var output = "";
    var topBaseTax   = (base != 0) ? AddComma(base.toFixed(2)) : "-";
    var topAmountDue = (amountDue != 0) ? AddComma(amountDue.toFixed(2)) : "-";
    var topPenalty   = (penalty != 0) ? AddComma(penalty.toFixed(2)) : "-";
    var topTotal     = AddComma(total.toFixed(2));
    var topQtr       = (qtr != "") ? qtr : "-";
    var topYear      = new Date();

    output += "<tr class='font-size-sm'>";
    output += "<td class='pt-1 pb-1'>"+title+"</td>";
    output += "<td class='text-right pt-1 pb-1'>" + topBaseTax + "</td>";
    output += "<td class='text-right pt-1 pb-1'>" + topAmountDue + "</td>";
    output += "<td class='text-right pt-1 pb-1'>" + topPenalty + "</td>";
    output += "<td class='text-right pt-1 pb-1'>" + topTotal + "</td>";
    output += "<td class='text-center pt-1 pb-1'>" + topQtr + "</td>";
    output += "<td class='text-center pt-1 pb-1'>" + topYear.getFullYear() + "</td>";
    output += "</tr>";

    return output;
}

var Back = function() {

    $("#modalTOP").modal('hide');
}

var AddComma = function(val) {
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
}

var ResetTotals = function() {
    TotalGross        = 0;
    TotalMayorsFee    = 0;
    TotalOthersFee    = 0;
    TotalTaxAmount    = 0;
    TotalPenalty      = 0;
    TotalAssessment   = 0;
    TotalFire         = 0;
    TotalCommunityTax = 0;
    TotalHealth       = 0;
    TotalPlates       = 0;
    TotalGarbageFee   = 0;
}




var ViewFees = function(assessID, genID) {
    AssessID = assessID;
    GenID = genID;
    ProceedToTOP();
    //$("#modalFees").modal('show');
}

var PrintTOP = function(assessID) {
    if(assessID) {
        window.open('/bplo/print-top/' + assessID);
    }
}



var CheckRequirements = function(assessID, status, bussName, genID) {
    $.ajax({
        url : check_subm_req_url,
        type: "post",
        data: {
            assessID : assessID,
            genID    : genID
        },
        dataType: "json",
        beforeSend: function() {
            $("#MainEntry").prop('hidden', true);
        },
        complete: function() {
            $("#RequirmentsEntry").prop('hidden', false);
        },
        success: function(res) {
            $("#reqSpanBussID").html(genID);
            $("#reqSpanBussName").html(decodeURIComponent(bussName));
            var table = $("#tblSubmittedReq tbody");
            var rd = ""; //row data
            if (res.length > 0) {
                $.each(res, function(index, value) {
                    rd += "<tr>";
                    rd += "<td class='font-size-sm' width='250'>"+ value.description +"</td>";
                    rd += "<td>";
                    rd += "<table class='table table-borderless table-hover responsive'>";
                    rd += "<tr>";
                    rd += "<th>File</th>";
                    rd += "<th>Date Uploaded</th>";
                    rd += "<th>Uploaded by</th>";
                    rd += "<th>Action</th>";
                    rd += "</tr>";
                    $.each(value.submitted_requirements, function(index, value) {
                        rd += "<tr class='font-size-sm'>";
                        rd += "<td>"+GenerateFileImg(value.filename)+"</td>";
                        rd += "<td>"+ConvertDate(value.created_at)+"</td>";
                        rd += "<td>"+value.lname+"</td>";
                        rd += "<td>"+GenerateButton(value.filename, genID)+"</td>";
                        rd += "</tr>";
                    });
                    rd += "<tr>";
                        rd += "</tr>";
                    rd += "</table>";
                    rd += "</td>";
                    rd += "</tr>";
                })
            } else {
                rd += "<tr><td colspan='2' class='text-center'>No data available</td></tr>";
            }
            table.empty();
            table.append(rd);
        },
        error: function (a,b,c) {
            forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
        }
    })
}

var GenerateFileImg = function(file) {
    var arrFile = file.split('.');
    return "<img health='25' width='25' src='/assets/media/svg/files/"+arrFile[1]+".svg'>";
}

var ConvertDate = function(date) {
    var d = new Date(date);
    var aD = d.toString().split(' ');
    return aD[2] + " " + aD[1] + ". " + aD[3];
}

var GenerateButton = function(file, genID) {
    return "<button data-container='body' data-toggle='tooltip' data-placement='top' title='Preview' type='button' class='btn btn-sm btn-clean btn-icon' onclick=PreviewFile('"+file+"','"+genID+"')>\
                <span class='svg-icon svg-icon-primary svg-icon-2x'>\
                    <svg width='24px' height='24px' viewBox='0 0 24 24' version='1.1'>\
                        <g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'>\
                            <polygon points='0 0 24 0 24 24 0 24'/>\
                            <path d='M12.2928955,6.70710318 C11.9023712,6.31657888 11.9023712,5.68341391 12.2928955,5.29288961 C12.6834198,4.90236532 13.3165848,4.90236532 13.7071091,5.29288961 L19.7071091,11.2928896 C20.085688,11.6714686 20.0989336,12.281055 19.7371564,12.675721 L14.2371564,18.675721 C13.863964,19.08284 13.2313966,19.1103429 12.8242777,18.7371505 C12.4171587,18.3639581 12.3896557,17.7313908 12.7628481,17.3242718 L17.6158645,12.0300721 L12.2928955,6.70710318 Z' fill='#000000' fill-rule='nonzero'/>\
                            <path d='M3.70710678,15.7071068 C3.31658249,16.0976311 2.68341751,16.0976311 2.29289322,15.7071068 C1.90236893,15.3165825 1.90236893,14.6834175 2.29289322,14.2928932 L8.29289322,8.29289322 C8.67147216,7.91431428 9.28105859,7.90106866 9.67572463,8.26284586 L15.6757246,13.7628459 C16.0828436,14.1360383 16.1103465,14.7686056 15.7371541,15.1757246 C15.3639617,15.5828436 14.7313944,15.6103465 14.3242754,15.2371541 L9.03007575,10.3841378 L3.70710678,15.7071068 Z' fill='#000000' fill-rule='nonzero' opacity='0.3' transform='translate(9.000003, 11.999999) rotate(-270.000000) translate(-9.000003, -11.999999) '/>\
                        </g>\
                    </svg>\
                </span>\
            </button>";
}

var PreviewFile = function(file, genID) {
    var path = "/bplofiles/"+genID+"/"+file;
    var arrFile = file.split(".");
    
    if( arrFile[1] != "pdf" ) {
        $("#divPdfFile").prop('hidden', true);
        $("#divImgFile").prop('hidden', false);
        $("#imgFile").attr('src', path);
        $("#imgDownload").attr('href', path);
        $("#btnDownload").show(0);
    } else {
        $("#divImgFile").prop('hidden', true);
        $("#divPdfFile").prop('hidden', false);
        $("#docpdf").attr('src', path);
        $("#btnDownload").hide(0);
    }
}

var CancelPreview = function() {
    $("#divPdfFile").prop('hidden', true);
    $("#divImgFile").prop('hidden', false);
    $("#btnDownload").hide(0);
    $("#imgFile").attr('src', '/assets/media/svg/files/jpg.svg');
}

var DownloadImg = function() {

    $("#imgDownload")[0].click();
}

var BackToMain = function() {
    $("#RequirmentsEntry").prop('hidden', true);
    $("#MainEntry").prop('hidden', false);
    CancelPreview();
}

var KTAssessment = function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    //Save and Print T.O.P
    $("#btn_save_print").click(function() {
        Swal.fire({
            title: "Are you sure?",
            html: "You want to create assessment for <br>Business ID: <b>"+GenID+"</b>",
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
                    url : create_assessment_url,
                    data: {
                        "genID"       : GenID,
                        "assessID"    : AssessID,
                        "isRenewal"   : IsRenewal,
                        "maleCount"   : $("#maleCount").val(),
                        "femaleCount" : $("#femaleCount").val(),
                        "paymentFreq" : $("#paymentFreq").val(),
                        "mayorsFee"   : TotalMayorsFee,
                        "garbageFee"  : TotalGarbageFee,
                        "othersFee"   : TotalOthersFee,
                        "taxAmount"   : TotalTaxAmount,
                        "fire"        : TotalFire,
                        "communityTax": TotalCommunityTax,
                        "health"      : TotalHealth,
                        "plates"      : TotalPlates,
                        "penalty"     : TotalPenalty,
                        "totalAmount" : TotalAssessment,
                    },
                    type: "POST",
                    beforeSend: function() {
                        _beforeSend();
                    },
                    complete: function(xhr) {
                        _complete();
                    },
                    success:function(res) {
                        res = res.trim();
                        if(res == 'success') {
                            GenID         = "";
                            AssessID      = "";
                            IsRenewal     = "";
                            IsCorporation = "";
                            GrossArray    = new Array();
                            ResetTotals();
                            _loadPendingAssessment();
                            _loadDoneAssessment();
                            $("#modalTOP").modal('hide');
                            CancelAssess();
                            forSwal("Assessment has been successfully created.", "success", "btn-success");
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
    })

    //Press enter in gross
    $("#bussGrossAmount").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            SaveGross();
        }
    });

    //On Load
    var _onLoad = function() {
        //
        $("#btnDownload").hide(0);
    }

    //Pending Asessment
    var _loadPendingAssessment = function() {
        if( table1 ) { 
            table1.clear();
            table1.destroy(); 
        }

        table1 = $('#tbl_pending').DataTable({
            responsive: true,
            processing: true,
            //serverSide: true,
            language: {                
                infoFiltered: ""
            },
            ajax: {
                url : assessment_list_url,
            },
            columns: [
                //{data: 'DT_RowIndex', name:'DT_RowIndex'},
                {
                    data: null,
                    name: 'Business ID',
                    render: function(data, type, row) {
                        return data.assessment[0].business.generated_id;
                    }
                },
                {
                    data: null,
                    name: 'Business Name',
                    render: function(data, type, row) {
                        return data.assessment[0].business.buss_name;
                    }
                },
                {
                    data: null,
                    name: 'Barangay',
                    render: function(data, type, row) {
                        return data.assessment[0].business.buss_brgy;
                    }
                },
                {
                    data: null,
                    name: 'Assessment Type',
                    render: function(data, type, row) {
                        var assessType = data.assessment[0].assessment_type_id;
                        var status = {
                            1: {'title': 'Closing', 'class': 'label-light-danger'},
                            2: {'title': 'Re-assessment', 'class': ' label-light-primary'},
                            3: {'title': 'New', 'class': ' label-light-info'},
                            4: {'title': 'Renewal', 'class': ' label-light-warning'},
                            5: {'title': 'Special Permit', 'class': ' label-light-primary'},
                        };
                        return '<span class="label ' + status[assessType].class + ' label-inline font-weight-bold label-lg">' + status[assessType].title + '</span>';
                    }
                },
                {data: 'created_at', name:'created_at'},
                {   
                    data: null,
                    name: "Action",
                    orderable: false,
                    searchable: false,
                    render: function( data, type, row ) {
                        var AssessID   = data.assessment[0].encrypted_id;
                        var AssessType = data.assessment[0].assessment_type_id;
                        var GenID      = data.assessment[0].business.generated_id;
                        var BussName   = data.assessment[0].business.buss_name;
                        return  '<center><div class="dropdown dropdown-inline">\
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
                                                <a type="button" class="navi-link" onclick=ViewDetails(\'' +AssessID+ '\')>\
                                                    <span class="navi-icon">\
                                                        <i class="la la-eye"></i>\
                                                    </span>\
                                                    <span class="navi-text">View Details</span>\
                                                </a>\
                                            </li>\
                                           <li class="navi-item">\
                                                <a type="button" class="navi-link" onclick=CheckRequirements(\'' +AssessID+ '\',\'' +AssessType+ '\',\'' +encodeURIComponent(BussName)+ '\',\'' +GenID+ '\')>\
                                                    <span class="navi-icon">\
                                                       <i class="la la-clipboard-list"></i>\
                                                    </span>\
                                                   <span class="navi-text">Check Requirements</span>\
                                                </a>\
                                            </li>\
                                            <li class="navi-item">\
                                                <a type="button" class="navi-link" onclick=AssessNow(\'' +AssessID+ '\',\'' +GenID+ '\')>\
                                                    <span class="navi-icon">\
                                                       <i class="la la-check-circle"></i>\
                                                    </span>\
                                                   <span class="navi-text">Assess Now</span>\
                                                </a>\
                                            </li>\
                                        </ul>\
                                    </div>\
                                </div></center>';
                    }
                },
            ],
        });
    }

    //Done Asessment
    var _loadDoneAssessment = function() {
        if( table2 ) { 
            table2.clear();
            table2.destroy(); 
        }

        table2 = $('#tbl_done').DataTable({
            responsive: true,
            processing: true,
            //serverSide: true,
            columnDefs: [{
                targets: '_all',
                createdCell: function (td, cellData, rowData, row, col) {
                    $(td).css('padding-right', '10px')
                    $(td).css('padding-left', '10px')
                    $(td).css('padding-top', '7px')
                    $(td).css('padding-bottom', '7px')
                    $(td).css('cursor', 'pointer')
                }
            }],
            language: {                
                infoFiltered: ""
            },
            ajax: {
                url : assessment_done_url,
            },
            columns: [
                //{data: 'DT_RowIndex', name:'DT_RowIndex'},
                {
                    data: null,
                    name: 'Business ID',
                    render: function(data, type, row) {
                        return data.assessment[0].business.generated_id;
                    }
                },
                {
                    data: null,
                    name: 'Business Name',
                    render: function(data, type, row) {
                        return data.assessment[0].business.buss_name;
                    }
                },
                {
                    data: null,
                    name: 'Barangay',
                    render: function(data, type, row) {
                        return data.assessment[0].business.buss_brgy;
                    }
                },
                {
                    data: null,
                    name: 'Assessment Type',
                    render: function(data, type, row) {
                        var assessType = data.assessment[0].assessment_type_id;
                        var status = {
                            1: {'title': 'Closing', 'class': 'label-light-danger'},
                            2: {'title': 'Re-assessment', 'class': ' label-light-primary'},
                            3: {'title': 'New', 'class': ' label-light-info'},
                            4: {'title': 'Renewal', 'class': ' label-light-warning'},
                            5: {'title': 'Special Permit', 'class': ' label-light-primary'},
                        };
                        return '<span class="label ' + status[assessType].class + ' label-inline font-weight-bold label-lg">' + status[assessType].title + '</span>';
                    }
                },
                {
                    data: null,
                    name: 'Assessment Date',
                    render: function(data, type, row) {
                        return data.assessment[0].assess_date;
                    }
                },
                {
                    data: null,
                    name: 'Total Amount',
                    render: function(data, type, row) {
                        return "<div class='text-right'>₱ " + data.assessment[0].total_amount + "</div>";
                    }
                },
                {   
                    data: null,
                    name: "Action",
                    orderable: false,
                    searchable: false,
                    render: function( data, type, row ) {
                        var AssessID = data.assessment[0].encrypted_id;
                        var AssessType = data.assessment[0].assessment_type_id;
                        var GenID = data.assessment[0].business.generated_id;
                        var BussName = data.assessment[0].business.buss_name;
                        return  '<center><div class="dropdown dropdown-inline">\
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
                                                <a type="button" class="navi-link" onclick=ViewDetails(\'' +AssessID+ '\')>\
                                                    <span class="navi-icon">\
                                                        <i class="la la-eye"></i>\
                                                    </span>\
                                                    <span class="navi-text">View Details</span>\
                                                </a>\
                                            </li>\
                                            <li class="navi-item">\
                                                <a type="button" class="navi-link" onclick=ViewFees(\'' +AssessID+  '\',\'' +GenID+ '\')>\
                                                    <span class="navi-icon">\
                                                       <i class="la la-clipboard-list"></i>\
                                                    </span>\
                                                   <span class="navi-text">View Fees</span>\
                                                </a>\
                                            </li>\
                                            <li class="navi-item">\
                                                <a type="button" class="navi-link" onclick=PrintTOP(\'' +AssessID+  '\',\'' +GenID+ '\')>\
                                                    <span class="navi-icon">\
                                                       <i class="la la-print"></i>\
                                                    </span>\
                                                   <span class="navi-text">Print T.O.P</span>\
                                                </a>\
                                            </li>\
                                        </ul>\
                                    </div>\
                                </div></center>';
                    }
                },
               
            ],
        });
    }

    //Assessment Other Details
    var _handleFormOtherDetails = function() {
        var validation;

        validation = FormValidation.formValidation(
            KTUtil.getById('form_other_details'),
            {
                fields: {
                    maleCount: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter 0 if there are no male employee'
                            },
                            digits: {
                                message: 'Please enter a number'
                            },
                            stringLength: {
                                max:11,
                                message: 'Maximum of 11 digits only'
                            }
                        }
                    },
                    femaleCount: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter 0 if there are no female employee'
                            },
                            digits: {
                                message: 'Please enter a number'
                            },
                            stringLength: {
                                max:11,
                                message: 'Maximum of 11 digits only'
                            }
                        }
                    },
                    paymentFreq: {
                        validators: {
                            notEmpty: {
                                message: 'This field is required'
                            }
                        }
                    },
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    submitButton: new FormValidation.plugins.SubmitButton(),
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }
            }
        );

        $("#btn_proceed_to_top").on('click', function(e) {
            e.preventDefault();

            validation.validate().then(function(status) {
                if (status == 'Valid') {
                    ProceedToTOP();
                } else {
                    var inputs = new Array("#maleCount", "#femaleCount");
                    $.each(inputs, function(index, value) {
                        var input = $(value).val();
                        if (input == "" || !$.isNumeric(input)) {
                            $(value).focus();
                            return false;
                        }
                    })
                }
            });
        });

        $("#btn_close_otherdetails").click(function(){
            validation.resetForm();
        });
    }

    return {
        // public functions
        init: function() {
            _onLoad();
            _loadPendingAssessment();
            _loadDoneAssessment();
            _handleFormOtherDetails();
        }
    };

}();

// Initialization
jQuery(document).ready(function() {
    KTAssessment.init();
});