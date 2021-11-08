@extends('layouts.guest_master')
@section('title') Tracking @endsection

@section('header_links') 
	<style type="text/css">
		.circle {
			border-radius: 50% !important;
			width: 100%;
   			height: 100%;
		}
	</style>
@endsection

@section('content')
@parent

<!--begin::Subheader-->
<div class="subheader py-5 py-lg-7 subheader-transparent" id="kt_subheader">
	<div class="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
		<div class="d-flex align-items-center mr-1">
			<div class="d-flex align-items-baseline flex-wrap mr-5">
				<h2 class="d-flex align-items-center text-dark font-weight-bold my-1 mr-3"> Tracking </h2>
			</div>
		</div>
	</div>
</div>
<!--end::Subheader-->

<!--begin::Entry-->
<div class="d-flex flex-column-fluid">
	<!--begin::Container-->
	<div class="container-fluid">

		<!--begin::Notice-->
		<div class="alert alert-custom alert-white alert-shadow gutter-b" role="alert">
			<div class="alert-text">
				<div class="mb-2">
					<span class='label label-xl label-secondary mr-2'></span> = PENDING,
					<span class='label label-xl label-success mr-2 ml-5'></span> = DONE,
					<span class='label label-xl label-primary mr-2 ml-5'></span> = DOING,
					<span class='label label-xl label-warning mr-2 ml-5'></span> = DAY(S) LAP,
					<span class='label label-xl label-danger ml-5'></span> = WEEK(S) LAP
				</div>
			</div>
		</div>
		<!--end::Notice-->

		<!--begin::Row-->
		<div class="row mb-5">
			<div class="col-5">&nbsp;</div>
			<div class="col-2">
				<div class="card card-custom gutter-b card-stretch circle bg-success">
					<div class="card-body text-center pt-15">
						<span class="svg-icon svg-icon-xxl svg-icon-dark">
							<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
							    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							        <rect x="0" y="0" width="24" height="24"/>
							        <path d="M8,4 L16,4 C17.1045695,4 18,4.8954305 18,6 L18,17.726765 C18,18.2790497 17.5522847,18.726765 17,18.726765 C16.7498083,18.726765 16.5087052,18.6329798 16.3242754,18.4639191 L12.6757246,15.1194142 C12.2934034,14.7689531 11.7065966,14.7689531 11.3242754,15.1194142 L7.67572463,18.4639191 C7.26860564,18.8371115 6.63603827,18.8096086 6.26284586,18.4024896 C6.09378519,18.2180598 6,17.9769566 6,17.726765 L6,6 C6,4.8954305 6.8954305,4 8,4 Z" fill="#000000"/>
							    </g>
							</svg>
						</span>
						<br><br>
						<label class="font-weight-bolder font-size-h4 mb-10">Application</label>
					</div>
				</div>
			</div>
			<div class="col-5">&nbsp;</div>
		</div>
		<!--end::Row-->

		<!--begin::Row-->
		<div class="row mb-5">
			<div class="col-2">&nbsp;</div>
			<div class="col-2">
				<div class="card card-custom gutter-b card-stretch circle bg-primary">
					<div class="card-body text-center pt-15">
						<span class="svg-icon svg-icon-xxl svg-icon-dark">
							<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
							    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							        <polygon points="0 0 24 0 24 24 0 24"/>
							        <path d="M1.4152146,4.84010415 C11.1782334,10.3362599 14.7076452,16.4493804 12.0034499,23.1794656 C5.02500006,22.0396582 1.4955883,15.9265377 1.4152146,4.84010415 Z" fill="#000000" opacity="0.3"/>
							        <path d="M22.5950046,4.84010415 C12.8319858,10.3362599 9.30257403,16.4493804 12.0067693,23.1794656 C18.9852192,22.0396582 22.5146309,15.9265377 22.5950046,4.84010415 Z" fill="#000000" opacity="0.3"/>
							        <path d="M12.0002081,2 C6.29326368,11.6413199 6.29326368,18.7001435 12.0002081,23.1764706 C17.4738192,18.7001435 17.4738192,11.6413199 12.0002081,2 Z" fill="#000000" opacity="0.3"/>
							    </g>
							</svg>
							<br><br>
						</span>
						<label class="font-weight-bolder font-size-h4 mb-10">Cenro</label>
					</div>
				</div>
			</div>
			<div class="col-1">&nbsp;</div>
			<div class="col-2">
				<div class="card card-custom gutter-b card-stretch bg-success circle">
					<div class="card-body text-center pt-15">
						<span class="svg-icon svg-icon-xxl svg-icon-dark">
							<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
							    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							        <rect x="0" y="0" width="24" height="24"/>
							        <path d="M13.5,21 L13.5,18 C13.5,17.4477153 13.0522847,17 12.5,17 L11.5,17 C10.9477153,17 10.5,17.4477153 10.5,18 L10.5,21 L5,21 L5,4 C5,2.8954305 5.8954305,2 7,2 L17,2 C18.1045695,2 19,2.8954305 19,4 L19,21 L13.5,21 Z M9,4 C8.44771525,4 8,4.44771525 8,5 L8,6 C8,6.55228475 8.44771525,7 9,7 L10,7 C10.5522847,7 11,6.55228475 11,6 L11,5 C11,4.44771525 10.5522847,4 10,4 L9,4 Z M14,4 C13.4477153,4 13,4.44771525 13,5 L13,6 C13,6.55228475 13.4477153,7 14,7 L15,7 C15.5522847,7 16,6.55228475 16,6 L16,5 C16,4.44771525 15.5522847,4 15,4 L14,4 Z M9,8 C8.44771525,8 8,8.44771525 8,9 L8,10 C8,10.5522847 8.44771525,11 9,11 L10,11 C10.5522847,11 11,10.5522847 11,10 L11,9 C11,8.44771525 10.5522847,8 10,8 L9,8 Z M9,12 C8.44771525,12 8,12.4477153 8,13 L8,14 C8,14.5522847 8.44771525,15 9,15 L10,15 C10.5522847,15 11,14.5522847 11,14 L11,13 C11,12.4477153 10.5522847,12 10,12 L9,12 Z M14,12 C13.4477153,12 13,12.4477153 13,13 L13,14 C13,14.5522847 13.4477153,15 14,15 L15,15 C15.5522847,15 16,14.5522847 16,14 L16,13 C16,12.4477153 15.5522847,12 15,12 L14,12 Z" fill="#000000"/>
							        <rect fill="#FFFFFF" x="13" y="8" width="3" height="3" rx="1"/>
							        <path d="M4,21 L20,21 C20.5522847,21 21,21.4477153 21,22 L21,22.4 C21,22.7313708 20.7313708,23 20.4,23 L3.6,23 C3.26862915,23 3,22.7313708 3,22.4 L3,22 C3,21.4477153 3.44771525,21 4,21 Z" fill="#000000" opacity="0.3"/>
							    </g>
							</svg>
							<br><br>
						</span>
						<label class="font-weight-bolder font-size-h4 mb-10">Engineering</label>
					</div>
				</div>
			</div>
			<div class="col-1">&nbsp;</div>
			<div class="col-2">
				<div class="card card-custom gutter-b card-stretch bg-warning circle">
					<div class="card-body text-center pt-15">
						<span class="svg-icon svg-icon-xxl svg-icon-dark">
							<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
							    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							        <rect x="0" y="0" width="24" height="24"/>
							        <path d="M10.5278225,22.5278225 L8.79765312,20.7976531 L9.99546268,18.4463973 L7.35584531,19.3558453 L5.04895282,17.0489528 L8.15438502,11.6366281 L2.74206034,14.7420603 L1.30025253,13.3002525 L9.26548692,8.03126375 C11.3411817,6.65819522 14.1285885,7.15099488 15.6076701,9.15253022 C17.1660799,11.2614147 17.1219524,14.1519817 15.4998952,16.212313 L10.5278225,22.5278225 Z" fill="#000000" opacity="0.3"/>
							        <path d="M22.4246212,4.91054166 L18.4071175,8.92804534 C17.6260689,9.70909393 16.359739,9.70909393 15.5786904,8.92804534 C14.7976418,8.14699676 14.7976418,6.8806668 15.5786904,6.09961822 L19.6029298,2.0753788 C19.7817428,2.41498256 19.9878937,2.74436937 20.2214305,3.06039796 C20.8190224,3.86907629 21.5791361,4.49033747 22.4246212,4.91054166 Z" fill="#000000" transform="translate(18.708763, 5.794605) rotate(-180.000000) translate(-18.708763, -5.794605) "/>
							    </g>
							</svg>
							<br><br>
						</span>
						<label class="font-weight-bolder font-size-h4 mb-10">Sanitary</label>
					</div>
				</div>
			</div>
			<div class="col-2">&nbsp;</div>
		</div>
		<!--end::Row-->

		<!--begin::Row-->
		<div class="row mb-5">
			<div class="col-5">&nbsp;</div>
			<div class="col-2">
				<div class="card card-custom gutter-b card-stretch circle">
					<div class="card-body text-center pt-15">
						<span class="svg-icon svg-icon-xxl svg-icon-dark">
							<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
							    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							        <rect x="0" y="0" width="24" height="24"/>
							        <path d="M18.1446364,11.84388 L17.4471627,16.0287218 C17.4463569,16.0335568 17.4455155,16.0383857 17.4446387,16.0432083 C17.345843,16.5865846 16.8252597,16.9469884 16.2818833,16.8481927 L4.91303792,14.7811299 C4.53842737,14.7130189 4.23500006,14.4380834 4.13039941,14.0719812 L2.30560137,7.68518803 C2.28007524,7.59584656 2.26712532,7.50338343 2.26712532,7.4104669 C2.26712532,6.85818215 2.71484057,6.4104669 3.26712532,6.4104669 L16.9929851,6.4104669 L17.606173,3.78251876 C17.7307772,3.24850086 18.2068633,2.87071314 18.7552257,2.87071314 L20.8200821,2.87071314 C21.4717328,2.87071314 22,3.39898039 22,4.05063106 C22,4.70228173 21.4717328,5.23054898 20.8200821,5.23054898 L19.6915238,5.23054898 L18.1446364,11.84388 Z" fill="#000000" opacity="0.3"/>
							        <path d="M6.5,21 C5.67157288,21 5,20.3284271 5,19.5 C5,18.6715729 5.67157288,18 6.5,18 C7.32842712,18 8,18.6715729 8,19.5 C8,20.3284271 7.32842712,21 6.5,21 Z M15.5,21 C14.6715729,21 14,20.3284271 14,19.5 C14,18.6715729 14.6715729,18 15.5,18 C16.3284271,18 17,18.6715729 17,19.5 C17,20.3284271 16.3284271,21 15.5,21 Z" fill="#000000"/>
							    </g>
							</svg>
						</span>
						<br><br>
						<label class="font-weight-bolder font-size-h4 mb-10">T.O.P</label>
					</div>
				</div>
			</div>
			<div class="col-2">&nbsp;</div>
		</div>
		<!--end::Row-->

		<!--begin::Row-->
		<div class="row mb-5">
			<div class="col-5">&nbsp;</div>
			<div class="col-2">
				<div class="card card-custom gutter-b card-stretch circle">
					<div class="card-body text-center pt-15">
						<span class="svg-icon svg-icon-xxl svg-icon-dark">
							<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
							    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							        <rect x="0" y="0" width="24" height="24"/>
							        <rect fill="#000000" opacity="0.3" x="7" y="4" width="10" height="4"/>
							        <path d="M7,2 L17,2 C18.1045695,2 19,2.8954305 19,4 L19,20 C19,21.1045695 18.1045695,22 17,22 L7,22 C5.8954305,22 5,21.1045695 5,20 L5,4 C5,2.8954305 5.8954305,2 7,2 Z M8,12 C8.55228475,12 9,11.5522847 9,11 C9,10.4477153 8.55228475,10 8,10 C7.44771525,10 7,10.4477153 7,11 C7,11.5522847 7.44771525,12 8,12 Z M8,16 C8.55228475,16 9,15.5522847 9,15 C9,14.4477153 8.55228475,14 8,14 C7.44771525,14 7,14.4477153 7,15 C7,15.5522847 7.44771525,16 8,16 Z M12,12 C12.5522847,12 13,11.5522847 13,11 C13,10.4477153 12.5522847,10 12,10 C11.4477153,10 11,10.4477153 11,11 C11,11.5522847 11.4477153,12 12,12 Z M12,16 C12.5522847,16 13,15.5522847 13,15 C13,14.4477153 12.5522847,14 12,14 C11.4477153,14 11,14.4477153 11,15 C11,15.5522847 11.4477153,16 12,16 Z M16,12 C16.5522847,12 17,11.5522847 17,11 C17,10.4477153 16.5522847,10 16,10 C15.4477153,10 15,10.4477153 15,11 C15,11.5522847 15.4477153,12 16,12 Z M16,16 C16.5522847,16 17,15.5522847 17,15 C17,14.4477153 16.5522847,14 16,14 C15.4477153,14 15,14.4477153 15,15 C15,15.5522847 15.4477153,16 16,16 Z M16,20 C16.5522847,20 17,19.5522847 17,19 C17,18.4477153 16.5522847,18 16,18 C15.4477153,18 15,18.4477153 15,19 C15,19.5522847 15.4477153,20 16,20 Z M8,18 C7.44771525,18 7,18.4477153 7,19 C7,19.5522847 7.44771525,20 8,20 L12,20 C12.5522847,20 13,19.5522847 13,19 C13,18.4477153 12.5522847,18 12,18 L8,18 Z M7,4 L7,8 L17,8 L17,4 L7,4 Z" fill="#000000"/>
							    </g>
							</svg>
						</span>
						<br><br>
						<label class="font-weight-bolder font-size-h4 mb-10">Payment</label>
					</div>
				</div>
			</div>
			<div class="col-5">&nbsp;</div>
		</div>
		<!--end::Row-->

		<!--begin::Row-->
		<div class="row mb-5">
			<div class="col-5">&nbsp;</div>
			<div class="col-2">
				<div class="card card-custom gutter-b card-stretch circle">
					<div class="card-body text-center pt-15">
						<span class="svg-icon svg-icon-xxl svg-icon-dark">
							<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
							    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							        <rect x="0" y="0" width="24" height="24"/>
							        <path d="M3.5,3 L5,3 L5,19.5 C5,20.3284271 4.32842712,21 3.5,21 L3.5,21 C2.67157288,21 2,20.3284271 2,19.5 L2,4.5 C2,3.67157288 2.67157288,3 3.5,3 Z" fill="#000000"/>
							        <path d="M6.99987583,2.99995344 L19.754647,2.99999303 C20.3069317,2.99999474 20.7546456,3.44771138 20.7546439,3.99999613 C20.7546431,4.24703684 20.6631995,4.48533385 20.497938,4.66895776 L17.5,8 L20.4979317,11.3310353 C20.8673908,11.7415453 20.8341123,12.3738351 20.4236023,12.7432941 C20.2399776,12.9085564 20.0016794,13 19.7546376,13 L6.99987583,13 L6.99987583,2.99995344 Z" fill="#000000" opacity="0.3"/>
							    </g>
							</svg>
						</span>
						<br><br>
						<label class="font-weight-bolder font-size-h4 mb-10">Releasing</label>
					</div>
				</div>
			</div>
			<div class="col-5">&nbsp;</div>
		</div>
		<!--end::Row-->
	</div>
	<!--end::Container-->
</div>
<!--end::Entry-->

@endsection

@section('page_scripts')
<script src="{{URL::asset('assets/plugins/custom/datatables/datatables.bundle.js?v=7.1.6')}}"></script>
@endsection