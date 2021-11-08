"use strict";
var table;
var items   = new Array();
var empID   = "";
var empName = "";

//Adding Class of Nav to become active
menuActive('li-menu-tools', 'li-submenu-tools-usermgt', 'li-lastmenu-tools-usermgt-actrl');

//Select Employee
var KTSelectEmp = function(id) {
	$.ajax({
		url : select_emp_url,
		type: "post",
		data: { id : id },
		beforeSend: function() {
			_beforeSend();
		},
		complete: function() {
			_complete();
		},
		success: function(res) {
			if( typeof res != "string") {
				empID = id;
				empName = res[0][0].EmpFullName;
				$("#hasEmp").empty();
				$("#hasEmp").append(res[1]);
				var lot 	= (res[0][0].Lot == "--") ? "" : res[0][0].Lot;
				var street 	= (res[0][0].Street == "--") ? "" : res[0][0].Street;
				var village = (res[0][0].Village == "--") ? "" : res[0][0].Village;
				var brgy 	= (res[0][0].Brgy == "--") ? "" : res[0][0].Brgy;
				var city 	= (res[0][0].City == "--") ? "" : res[0][0].City;
				var prov 	= (res[0][0].Province == "--") ? "" : res[0][0].Province;
				var completeAddr = lot+" "+street+" "+village+ " "+brgy+" " +city+" "+prov;
				$(".noEmp").hide(0);
				$(".hasEmp").show(0);
				$("#spanEmpFullName").text(res[0][0].EmpFullName);
				$("#spanEmpEmail").text(res[0][0].Email);
				$("#spanEmpDept").text("BPLO");
				$("#spanEmpProv").text(res[0][0].Province);
				$("#spanCompleteAddr").text(completeAddr);
				$("#btn_cancel").show(0);
				$("#empModal").modal('hide');
				$("#btns").show(0);
			} else {
				forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
			}
		},
		error: function(a,b,c) {
			forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
		}
	})
}

//View Details
var KTViewDetails = function(id) {
	$.ajax({
		url : fetch_empdetails_url,
		type: "post",
		data: { id : id },
		dataType: "json",
		success: function(res) {
			if( res != "not_found") {
				Object.keys(res[0]).forEach(function(key) {
					var spanID = "#"+key;
				  	$(spanID).text(res[0][key])
				})
				$("#empDetailsModal").modal('show');
			} else {
				forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
			}
		},
		error: function(a,b,c) {
			forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
		}
	})
}

// Class definition
var KTAControl = function () {

	var KTLayoutAsideToggle;
	
	if (KTLayoutAsideToggle && KTLayoutAsideToggle.onToggle) {
        var sticky = new Sticky('.sticky');

        KTLayoutAsideToggle.onToggle(function() {
            setTimeout(function() {
                sticky.update(); // update sticky positions on aside toggle
            }, 500);
        });
    }

	$.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
	/*********************************** BEGIN UTILITY *******************************************/
		/*var _hideDiv = function(showDiv) {
			var divs = ['#addEmpContent', '#empListContent', '#editUserContent'];
			for (var i = 0; i < divs.length; i++) {
				if(divs[i] != showDiv) {
					$(divs[i]).hide(0)
				}
			}
			$(showDiv).show(0);
		}

		var _activeTab = function(tab) {
			$(".tab-panel").removeClass('text-primary');
			$(".tab-panel").removeClass('font-size-h6');
			$(tab).addClass('text-primary');
			$(tab).addClass('font-size-h6');
		}

		var _getUrlParameter = function(sParam) {
		    var sPageURL = window.location.search.substring(1),
		        sURLVariables = sPageURL.split('&'),
		        sParameterName,
		        i,
		        action;

		    for (i = 0; i < sURLVariables.length; i++) {
		        sParameterName = sURLVariables[i].split('=');

		        if (sParameterName[0] === sParam) {
		            action = sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
		        }
		    }

		    if(action == "list") {
				_hideDiv("#empListContent");
				_activeTab("#empListNav");
				_loadTable();
		    } else {
		    	_hideDiv("#addEmpContent");
				_activeTab("#addEmpNav");
		    }
		}

		$("#empListNav").click(function() {
			_hideDiv("#empListContent");
			_activeTab("#empListNav");
			_loadTable();
			window.history.replaceState(null, null, "?action=list");
		});

		$("#addEmpNav").click(function() {
			_hideDiv("#addEmpContent");
			_activeTab("#addEmpNav");
			window.history.replaceState(null, null, "?action=create");
		});

		$("#editUserNav").click(function() {
			_hideDiv("#editUserContent");
			_activeTab("#editUserNav");
		});*/
	/***********************************   END UTILITY *******************************************/

	/*********************************** BEGIN FUNCTIONS *****************************************/
		$("#btn_createpriv").click(function() {
			$("#loginModal").modal('show');
			$("#password").val('').focus();
		});

		$("#btn_submit").click(function(){
	        if($("#password").val() != "") {
	        	if(empID != "") 
	        	{
	        		var voidStatus = ( $("#voidAuth").is(':checked') ) ? 1 : 0;
		            items = new Array();
					$.each($(".level2").find('input'), function(index, value){
						if($(value).is(':checked')) {
							var level1_id = $(value).attr('data-level1-id');
							var level2_id = $(value).attr('id');
							var item = {
								"tblmenu_level1_id" : level1_id,
								"tblmenu_level2_id" : level2_id,
								"tblmenu_level3_id" : null,
							};
							items.push(item);
						}
					})
					$.each($(".level3").find('input'), function(index, value){
						if($(value).is(':checked')) {
							var level1_id = $(value).attr('data-level1-id');
							var level2_id = $(value).attr('data-level2-id');
							var level3_id = $(value).attr('id');
							var item = {
								"tblmenu_level1_id" : level1_id,
								"tblmenu_level2_id" : level2_id,
								"tblmenu_level3_id" : level3_id
							};
							items.push(item);
						}
					});
					$.ajax({
						url : create_priv_url,
						type: "post",
						data: { 
							voidStatus : voidStatus,
							items 	   : JSON.stringify(items),
							empID 	   : empID,
							password   : $("#password").val()
						},
						beforeSend:function() {
		                    $("#btn_close, #btn_submit").prop('disabled', true);
		                    $("#btn_submit").addClass('spinner spinner-white spinner-right');
		                },
		                complete: function(){
		                    $("#btn_submit").removeClass('spinner spinner-white spinner-right');
		                    $("#btn_close, #btn_submit").prop('disabled', false);
		                },
						success: function(res) {
							res = res.trim();
							if( res == "success") {
								Swal.fire({
			                        title: "Success!",
			                        html: "Privileges has been created for <br><b>" + empName +"</b>",
			                        icon: "success",
			                        buttonsStyling: false,
							        confirmButtonText: "Ok, got it!",
							        customClass: {
							            confirmButton: "btn font-weight-bold btn-success"
							        }
		                    	});
		                    	_reset();
								$("#password").val('');
								$("#loginModal").modal('hide');
							}  else if( res == "failed_pass") {
		                        $(".alert").show(0);
	                    	} else {
								forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
							}
						},
						error: function(a,b,c) {
							forSwal("An error occured. Please contact the admin. Or try to refresh the page.", "error", "btn-danger");
						}
					});
				} 
				else {
					forSwal("No employee found!", "error", "btn-danger");
				}
	        } else {
	            $("#password").focus();
	        }
	    });
	    
		$("#password").on('keypress',function(e) {
	        if(e.which == 13) {
	            if($(this).val() != "") {
	                $("#btn_submit").click();
	            }
	        }
	    });

	    $(".close").click(function(){
	        $(".alert").fadeOut();
	    });

	    $("#btn_cancel").click(function(){
	    	_reset();
	    })

	    $("#btn_reset").click(function(){
	    	KTSelectEmp(empID);
	    })

	    //Reset
	    var _reset = function(){
	    	items = new Array();
	    	empID = "";
	    	empName = "";
	    	$("#spanEmpFullName").text("--");
			$("#spanEmpEmail").text("--");
			$("#spanEmpDept").text("--");
			$("#spanEmpProv").text("--");
			$("#spanCompleteAddr").text("--");
			$("#hasEmp").empty();
	    	$(".hasEmp").hide(0);
			$("#btns").hide(0);
			$(".noEmp").show(0);
			$("#btn_cancel").hide(0);
	    }

		//Load DataTable
	    var _loadTable = function() {

	    	if( table ) { 
	    		table.clear();
	    		table.destroy();
	    	}

	        table = $('#tbl_users').DataTable({
	        	responsive: true,
	            processing: true,
	            serverSide: true,
	            bLengthChange: false,
	            info: false,
	            language: {                
		            infoFiltered: ""
		        },
	            ajax: {
	                method : "POST",
	                url    : fetch_empacontrol_url,
	                data: {
						columnsDef: [
							'DT_RowIndex', 
							null, 
							'FullName', 
							null, 
							//'Birthday', 
							'Email', 
							'CreatedAt', 
							'Action'
						],
					},
	            },
	            columns: [
	            	{data: 'DT_RowIndex'},
	            	{data: null},
					{data: 'FullName'},
					{data: null},
					//{data: 'Birthday'},
					{data: 'Email'},
					{data: 'CreatedAt'},
					{data: 'Action', orderable:false, searchable: false},
				],
	            columnDefs: [
	            	{   
	                    targets: 1,
	                    title: "Employee",
	                    width: 150,
	                    render: function( data, type, row ) {
	                        return `<div class="d-flex align-items-center">\
	                                    <!--<div class="symbol symbol-40 flex-shrink-0">\
	                                        <img src="../../assets/media/users/` + 'default.jpg' + `" alt="photo">\
	                                    </div>-->\
	                                    <div class="ml-0">\
				                            <span class="text-dark-75 font-weight-bold line-height-sm d-block pb-2">` + row.FullName + `</span>\
				                            <span class="text-muted text-hover-primary font-size-sm">` + row.position  + `</span>\
				                        </div>\
	                                </div>`;
	                        
	                    }
	                },
	                {   
	                    targets: 3,
	                    title: "Department",
	                    render: function( data, type, row ) {
	                        return "Department"
	                    }
	                }
	            ]
	        });
	    };
	/***********************************   END FUNCTIONS *****************************************/

	return {
		// public functions
		init: function () {
			_loadTable();
			$(".hasEmp").hide(0);
			$(".alert").hide(0);
			$("#btn_cancel").hide(0);
			$("#btns").hide(0);
		}
	};

}();

jQuery(document).ready(function () {
	KTAControl.init();
});
