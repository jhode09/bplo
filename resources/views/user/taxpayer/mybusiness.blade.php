@extends('layouts.guest_master')
@section('title') My Business @endsection

@section('header_links') 
	<link href="{{URL::asset('assets/plugins/custom/datatables/datatables.bundle.css?v=7.1.6')}}" rel="stylesheet" type="text/css" />
@endsection

@section('content')
@parent

<!--begin::Subheader-->
<div class="subheader py-5 py-lg-7 subheader-transparent" id="kt_subheader">
	<div class="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
		<div class="d-flex align-items-center mr-1">
			<div class="d-flex align-items-baseline flex-wrap mr-5">
				<h2 class="d-flex align-items-center text-dark font-weight-bold my-1 mr-3"> My business </h2>
			</div>
		</div>
	</div>
</div>
<!--end::Subheader-->

<!--begin::Entry-->
<div class="d-flex flex-column-fluid">
	<!--begin::Container-->
	<div class="container-fluid">
		<!--begin::Card-->
		<div class="card card-custom">
			<div class="card-header card-header-tabs-line">
				<div class="card-title">
					<h3 class="card-label">
						Business Details
					</h3>
				</div>
			</div>
			<div class="card-body">
				<div class="row">
					<div class="col-6">
						<!-- begin::Step 1 -->
							<span class="text-success font-size-lg font-weight-bolder">
								<span class="svg-icon svg-icon-success svg-icon-2x">
									<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
									    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
									        <rect x="0" y="0" width="24" height="24"/>
									        <path d="M8,4 L16,4 C17.1045695,4 18,4.8954305 18,6 L18,17.726765 C18,18.2790497 17.5522847,18.726765 17,18.726765 C16.7498083,18.726765 16.5087052,18.6329798 16.3242754,18.4639191 L12.6757246,15.1194142 C12.2934034,14.7689531 11.7065966,14.7689531 11.3242754,15.1194142 L7.67572463,18.4639191 C7.26860564,18.8371115 6.63603827,18.8096086 6.26284586,18.4024896 C6.09378519,18.2180598 6,17.9769566 6,17.726765 L6,6 C6,4.8954305 6.8954305,4 8,4 Z" fill="#000000"/>
									    </g>
									</svg>
								</span>
								Application Details
							</span>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Business ID:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="permitNum">--</span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Business Status:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="bussStatus">--</span>
								</div>
							</div>
							<div class="row align-items-center pt-2 mb-5">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Mode of Payment:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="paymentFrequency">--</span>
								</div>
							</div>
						<!-- end::Step 1 -->

						<!-- begin::Step 2 -->
							<span class="text-success font-size-lg font-weight-bolder">
								<span class="svg-icon svg-icon-success svg-icon-2x">
									<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
									    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
									        <rect x="0" y="0" width="24" height="24"/>
									        <path d="M8,4 L16,4 C17.1045695,4 18,4.8954305 18,6 L18,17.726765 C18,18.2790497 17.5522847,18.726765 17,18.726765 C16.7498083,18.726765 16.5087052,18.6329798 16.3242754,18.4639191 L12.6757246,15.1194142 C12.2934034,14.7689531 11.7065966,14.7689531 11.3242754,15.1194142 L7.67572463,18.4639191 C7.26860564,18.8371115 6.63603827,18.8096086 6.26284586,18.4024896 C6.09378519,18.2180598 6,17.9769566 6,17.726765 L6,6 C6,4.8954305 6.8954305,4 8,4 Z" fill="#000000"/>
									    </g>
									</svg>
								</span>
								Business Details
							</span>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Business Name:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="businessName">--</span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Franchise Name:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="franchiseName">--</span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Business TIN:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="tin_first">--</span> 
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="tin_second"></span> 
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="tin_third"></span> 
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="tin_fourth"></span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2 ">Company Email:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md font-weight-bold" id="emailAddress">--</span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2 ">Mobile No.:</span>
								</div>
								<div class="col-7">
									( 09 ) <span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="phoneNumber">--</span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Name of TAX Payer:</span>
								</div>
								<div class="col-6">
									<span class="text-dark text-label font-size-md text-uppercase  mr-1 font-weight-bold" id= "taxPayerLname">--</span>
									<span class="text-dark text-label font-size-md text-uppercase mr-1  font-weight-bold" id= "taxPayerFname"></span>
									<span class="text-dark text-label font-size-md text-uppercase mr-1  font-weight-bold" id= "taxPayerMname"></span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">TaxPayer's Phone No.:</span>
								</div>
								<div class="col-7">
									( 09 ) <span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="taxPayerPhoneNumber">--</span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Owner's Name:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase  mr-1 font-weight-bold" id= "presidentLname">--</span>
									<span class="text-dark text-label font-size-md text-uppercase mr-1  font-weight-bold" id= "presidentFname"></span>
									<span class="text-dark text-label font-size-md text-uppercase mr-1  font-weight-bold" id= "presidentMname"></span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Owner's Phone Number:</span>
								</div>
								<div class="col-7">
									( 09 ) <span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="ownersPhoneNumber">--</span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Owner's Email:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="ownersEmailAddress">--</span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Total Female Employees:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="totalFemaleEmployee">--</span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Total Male Employees:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="totalMaleEmployee">--</span>
								</div>
							</div>
							<div class="row align-items-center pt-2 mb-6">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Total Employees in Establishment:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="totalBuildingEmployee">--</span>
								</div>
							</div>
						<!-- end::Step 2 -->

						<!-- begin::Step 3 -->
							<span class="text-success font-size-lg font-weight-bolder">
								<span class="svg-icon svg-icon-success svg-icon-2x">
									<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
									    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
									        <rect x="0" y="0" width="24" height="24"/>
									        <path d="M8,4 L16,4 C17.1045695,4 18,4.8954305 18,6 L18,17.726765 C18,18.2790497 17.5522847,18.726765 17,18.726765 C16.7498083,18.726765 16.5087052,18.6329798 16.3242754,18.4639191 L12.6757246,15.1194142 C12.2934034,14.7689531 11.7065966,14.7689531 11.3242754,15.1194142 L7.67572463,18.4639191 C7.26860564,18.8371115 6.63603827,18.8096086 6.26284586,18.4024896 C6.09378519,18.2180598 6,17.9769566 6,17.726765 L6,6 C6,4.8954305 6.8954305,4 8,4 Z" fill="#000000"/>
									    </g>
									</svg>
								</span>
								Business Identification
							</span>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">SEC Registration No.:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="sec_number">--</span>
								</div>
							</div>
							<div class="row align-items-center">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">SEC Date:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="sec_date">--</span>
								</div>
							</div>
							<div class="row align-items-center">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">SEC Expiry:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="sec_expiry">--</span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">DTI Registration No.:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="dti_number">--</span>
								</div>
							</div>
							<div class="row align-items-center">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">DTI Date:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="dti_date">--</span>
								</div>
							</div>
							<div class="row align-items-center">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">DTI Expiry:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="dti_expiry">--</span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">CDA Registration No.:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="cda_number">--</span>
								</div>
							</div>
							<div class="row align-items-center">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">CDA Date:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="cda_date">--</span>
								</div>
							</div>
							<div class="row align-items-center">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">CDA Expiry:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="cda_expiry">--</span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">SSS Registration No.:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="sss_number">--</span>
								</div>
							</div>
							<div class="row align-items-center">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">SSS Date:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="sss_date">--</span>
								</div>
							</div>
							<div class="row align-items-center">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">SSS Expiry:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="sss_expiry">--</span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">BC Registration No.:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="bc_number">--</span>
								</div>
							</div>
							<div class="row align-items-center">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">BC Date:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="bc_date">--</span>
								</div>
							</div>
							<div class="row align-items-center">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">BC Expiry:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="bc_expiry">--</span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">PEZA Registration No.:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="peza_number">--</span>
								</div>
							</div>
							<div class="row align-items-center">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">PEZA Date:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="peza_date">--</span>
								</div>
							</div>
							<div class="row align-items-center">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">PEZA Expiry:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="peza_expiry">--</span>
								</div>
							</div>
						<!-- end::Step 3 -->
					</div>
					<div class="col-6">
						<!-- begin::Step 4 -->
							<span class="text-success font-size-lg font-weight-bolder">
								<span class="svg-icon svg-icon-success svg-icon-2x">
									<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
									    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
									        <rect x="0" y="0" width="24" height="24"/>
									        <path d="M8,4 L16,4 C17.1045695,4 18,4.8954305 18,6 L18,17.726765 C18,18.2790497 17.5522847,18.726765 17,18.726765 C16.7498083,18.726765 16.5087052,18.6329798 16.3242754,18.4639191 L12.6757246,15.1194142 C12.2934034,14.7689531 11.7065966,14.7689531 11.3242754,15.1194142 L7.67572463,18.4639191 C7.26860564,18.8371115 6.63603827,18.8096086 6.26284586,18.4024896 C6.09378519,18.2180598 6,17.9769566 6,17.726765 L6,6 C6,4.8954305 6.8954305,4 8,4 Z" fill="#000000"/>
									    </g>
									</svg>
								</span>
								Address Details
							</span>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Business Address:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase mr-1 font-weight-bold mr-1" id= "businessHouseNo">--</span>
									<span class="text-dark text-label font-size-md text-uppercase mr-1  font-weight-bold mr-1" id= "businessBuildingName"></span>
									<span class="text-dark text-label font-size-md text-uppercase mr-1  font-weight-bold mr-1" id= "businessSubdivision"></span>

									<span class="text-dark text-label font-size-md text-uppercase mr-1  font-weight-bold mr-1" id= "businessBarangay"></span>
									<span class="text-dark text-label font-size-md text-uppercase mr-1  font-weight-bold mr-1" id= "businessCity"></span>
									<span class="text-dark text-label font-size-md text-uppercase mr-1  font-weight-bold mr-1" id= "businessProvince"></span>
									<span class="text-dark text-label font-size-md text-uppercase mr-1  font-weight-bold mr-1" id= "businessRegion"></span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Business Area:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase  mr-1 font-weight-bold" id= "businessArea">--</span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Owners Address:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase  mr-1 font-weight-bold mr-1" id= "ownersHouseNo">--</span>
									<span class="text-dark text-label font-size-md text-uppercase mr-1  font-weight-bold mr-1" id= "ownersBuildingName"></span>
									<span class="text-dark text-label font-size-md text-uppercase mr-1  font-weight-bold mr-1" id= "ownersSubdivision"></span>

									<span class="text-dark text-label font-size-md text-uppercase mr-1  font-weight-bold mr-1" id= "ownersBarangay"></span>
									<span class="text-dark text-label font-size-md text-uppercase mr-1  font-weight-bold mr-1" id= "ownersCity"></span>
									<span class="text-dark text-label font-size-md text-uppercase mr-1  font-weight-bold mr-1" id= "ownersProvince"></span>
									<span class="text-dark text-label font-size-md text-uppercase mr-1  font-weight-bold mr-1" id= "ownersRegion"></span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Location Type:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase  mr-1 font-weight-bold" id="locationType">--</span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Lease Amount:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase  mr-1 font-weight-bold" id="leaseAmount">--</span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Lessors Name:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase  mr-1 font-weight-bold" id= "lessorsLname">--</span>
									<span class="text-dark text-label font-size-md text-uppercase mr-1  font-weight-bold" id= "lessorsFname"></span>
									<span class="text-dark text-label font-size-md text-uppercase mr-1  font-weight-bold" id= "lessorsMname"></span>
								</div>
							</div>
							<div class="row align-items-center pt-2 mb-6">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Lessors Address:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase  mr-1 font-weight-bold" id= "lessorsAddress">--</span>
								</div>
							</div>
						<!-- end::Step 4 -->

						<!-- begin::Step 5 -->
							<span class="text-success font-size-lg font-weight-bolder">
								<span class="svg-icon svg-icon-success svg-icon-2x">
									<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
									    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
									        <rect x="0" y="0" width="24" height="24"/>
									        <path d="M8,4 L16,4 C17.1045695,4 18,4.8954305 18,6 L18,17.726765 C18,18.2790497 17.5522847,18.726765 17,18.726765 C16.7498083,18.726765 16.5087052,18.6329798 16.3242754,18.4639191 L12.6757246,15.1194142 C12.2934034,14.7689531 11.7065966,14.7689531 11.3242754,15.1194142 L7.67572463,18.4639191 C7.26860564,18.8371115 6.63603827,18.8096086 6.26284586,18.4024896 C6.09378519,18.2180598 6,17.9769566 6,17.726765 L6,6 C6,4.8954305 6.8954305,4 8,4 Z" fill="#000000"/>
									    </g>
									</svg>
								</span>
								Business Activities Details
							</span>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Business Type:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="organizationType">--</span>
								</div>
							</div>
							<div class="row align-items-center pt-2">
								<div class="col-3 text-right">
									<span class="text-muted font-weight-bolder font-size-md mr-2">Business Size:</span>
								</div>
								<div class="col-7">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="businessSize">--</span>
								</div>
							</div>
						<!-- end::Step 5 -->

						<!-- begin::Business Lines -->
							<span class="text-success font-size-lg font-weight-bolder">
								<span class="svg-icon svg-icon-success svg-icon-2x">
									<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
									    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
									        <rect x="0" y="0" width="24" height="24"/>
									        <path d="M8,4 L16,4 C17.1045695,4 18,4.8954305 18,6 L18,17.726765 C18,18.2790497 17.5522847,18.726765 17,18.726765 C16.7498083,18.726765 16.5087052,18.6329798 16.3242754,18.4639191 L12.6757246,15.1194142 C12.2934034,14.7689531 11.7065966,14.7689531 11.3242754,15.1194142 L7.67572463,18.4639191 C7.26860564,18.8371115 6.63603827,18.8096086 6.26284586,18.4024896 C6.09378519,18.2180598 6,17.9769566 6,17.726765 L6,6 C6,4.8954305 6.8954305,4 8,4 Z" fill="#000000"/>
									    </g>
									</svg>
								</span>
								Business Lines
							</span>
							<div class="row align-items-center pt-2">
								<div class="col-12">
									<span class="text-dark text-label font-size-md text-uppercase font-weight-bold" id="businessLines">--</span>
								</div>
							</div>
						<!-- end::Business Lines -->
					</div>
				</div>
			</div>
		</div>
		<!--end::Card-->
	</div>
	<!--end::Container-->
</div>
<!--end::Entry-->

@endsection

@section('page_scripts')
@endsection