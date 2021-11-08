@extends('layouts.guest_master')
@section('title') Payment History @endsection

@section('header_links') 
	<link href="{{URL::asset('assets/plugins/custom/datatables/datatables.bundle.css?v=7.1.6')}}" rel="stylesheet" type="text/css" />
	<script src="{{URL::asset('assets/js/jspdf.min.js')}}"></script>
@endsection

@section('content')
@parent

<!--begin::Subheader-->
<div class="subheader py-5 py-lg-7 subheader-transparent" id="kt_subheader">
	<div class="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
		<div class="d-flex align-items-center mr-1">
			<div class="d-flex align-items-baseline flex-wrap mr-5">
				<h2 class="d-flex align-items-center text-dark font-weight-bold my-1 mr-3"> Transactions </h2>
				<ul class="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold my-2 p-0">
					<li class="breadcrumb-item">
						<a href="" class="text-muted">Payment History</a>
					</li>
				</ul>
			</div>
		</div>
		<div class="d-flex align-items-center">
			<div class="input-group mr-5 ml-2" id="dateRange">
				<input type="text" id="dateRange1" class="form-control" readonly="readonly" placeholder="Select date range">
				<div class="input-group-append">
					<span class="input-group-text">
						<i class="la la-calendar-check-o text-primary icon-lg"></i>
					</span>
				</div>
			</div>
			<button id="btnFilter" type="button" class="btn btn-primary">Filter</button>
		</div>
	</div>
</div>
<!--end::Subheader-->

<!--begin::Entry-->
<div class="d-flex flex-column-fluid">
	<!--begin::Container-->
	<div class="container-fluid">

		<!--Begin::Row-->
		<div class="row">
			<div class="col-xl-3">
				<div class="card card-custom card-stretch gutter-b">
					<div class="card-body">
						<span class="svg-icon svg-icon-2x svg-icon-success">
							<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
							    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							        <rect x="0" y="0" width="24" height="24"/>
							        <path d="M2,6 L21,6 C21.5522847,6 22,6.44771525 22,7 L22,17 C22,17.5522847 21.5522847,18 21,18 L2,18 C1.44771525,18 1,17.5522847 1,17 L1,7 C1,6.44771525 1.44771525,6 2,6 Z M11.5,16 C13.709139,16 15.5,14.209139 15.5,12 C15.5,9.790861 13.709139,8 11.5,8 C9.290861,8 7.5,9.790861 7.5,12 C7.5,14.209139 9.290861,16 11.5,16 Z" fill="#000000" opacity="0.3" transform="translate(11.500000, 12.000000) rotate(-345.000000) translate(-11.500000, -12.000000) "/>
							        <path d="M2,6 L21,6 C21.5522847,6 22,6.44771525 22,7 L22,17 C22,17.5522847 21.5522847,18 21,18 L2,18 C1.44771525,18 1,17.5522847 1,17 L1,7 C1,6.44771525 1.44771525,6 2,6 Z M11.5,16 C13.709139,16 15.5,14.209139 15.5,12 C15.5,9.790861 13.709139,8 11.5,8 C9.290861,8 7.5,9.790861 7.5,12 C7.5,14.209139 9.290861,16 11.5,16 Z M11.5,14 C12.6045695,14 13.5,13.1045695 13.5,12 C13.5,10.8954305 12.6045695,10 11.5,10 C10.3954305,10 9.5,10.8954305 9.5,12 C9.5,13.1045695 10.3954305,14 11.5,14 Z" fill="#000000"/>
							    </g>
							</svg>
						</span>
						<span class="card-title font-weight-bolder text-dark-75 font-size-h2 mb-0 mt-6 d-block">
							<span id="OPAmount">1</span>
						</span>
						<span class="font-weight-bold font-size-h5 text-muted">Total Payment Entries</span>
					</div>
				</div>
			</div>
			<div class="col-xl-3">
				<div class="card card-custom card-stretch gutter-b">
					<div class="card-body">
						<span class="svg-icon svg-icon-2x svg-icon-success">
							<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
							    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							        <rect x="0" y="0" width="24" height="24"/>
							        <path d="M2,6 L21,6 C21.5522847,6 22,6.44771525 22,7 L22,17 C22,17.5522847 21.5522847,18 21,18 L2,18 C1.44771525,18 1,17.5522847 1,17 L1,7 C1,6.44771525 1.44771525,6 2,6 Z M11.5,16 C13.709139,16 15.5,14.209139 15.5,12 C15.5,9.790861 13.709139,8 11.5,8 C9.290861,8 7.5,9.790861 7.5,12 C7.5,14.209139 9.290861,16 11.5,16 Z" fill="#000000" opacity="0.3" transform="translate(11.500000, 12.000000) rotate(-345.000000) translate(-11.500000, -12.000000) "/>
							        <path d="M2,6 L21,6 C21.5522847,6 22,6.44771525 22,7 L22,17 C22,17.5522847 21.5522847,18 21,18 L2,18 C1.44771525,18 1,17.5522847 1,17 L1,7 C1,6.44771525 1.44771525,6 2,6 Z M11.5,16 C13.709139,16 15.5,14.209139 15.5,12 C15.5,9.790861 13.709139,8 11.5,8 C9.290861,8 7.5,9.790861 7.5,12 C7.5,14.209139 9.290861,16 11.5,16 Z M11.5,14 C12.6045695,14 13.5,13.1045695 13.5,12 C13.5,10.8954305 12.6045695,10 11.5,10 C10.3954305,10 9.5,10.8954305 9.5,12 C9.5,13.1045695 10.3954305,14 11.5,14 Z" fill="#000000"/>
							    </g>
							</svg>
						</span>
						<span class="card-title font-weight-bolder text-dark-75 font-size-h2 mb-0 mt-6 d-block">
							₱ <span id="PAmount">10,000.00</span>
						</span>
						<span class="font-weight-bold font-size-h5 text-muted">Total Payment Amount</span>
					</div>
				</div>
			</div>
			<div class="col-xl-3">
				<div class="card card-custom card-stretch gutter-b">
					<div class="card-body">
						<span class="svg-icon svg-icon-2x svg-icon-primary">
							<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
							    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							        <rect x="0" y="0" width="24" height="24"/>
							        <path d="M14,9 L14,8 C14,6.8954305 13.1045695,6 12,6 C10.8954305,6 10,6.8954305 10,8 L10,9 L8,9 L8,8 C8,5.790861 9.790861,4 12,4 C14.209139,4 16,5.790861 16,8 L16,9 L14,9 Z M14,9 L14,8 C14,6.8954305 13.1045695,6 12,6 C10.8954305,6 10,6.8954305 10,8 L10,9 L8,9 L8,8 C8,5.790861 9.790861,4 12,4 C14.209139,4 16,5.790861 16,8 L16,9 L14,9 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"/>
							        <path d="M6.84712709,9 L17.1528729,9 C17.6417121,9 18.0589022,9.35341304 18.1392668,9.83560101 L19.611867,18.671202 C19.7934571,19.7607427 19.0574178,20.7911977 17.9678771,20.9727878 C17.8592143,20.9908983 17.7492409,21 17.6390792,21 L6.36092084,21 C5.25635134,21 4.36092084,20.1045695 4.36092084,19 C4.36092084,18.8898383 4.37002252,18.7798649 4.388133,18.671202 L5.86073316,9.83560101 C5.94109783,9.35341304 6.35828794,9 6.84712709,9 Z" fill="#000000"/>
							    </g>
							</svg>
						</span>
						<span class="card-title font-weight-bolder text-dark-75 font-size-h2 mb-0 mt-6 d-block">
							<span id="OPAmount">1</span>
						</span>
						<span class="font-weight-bold font-size-h5 text-muted">Total Void Payment Entries</span>
					</div>
				</div>
			</div>
			<div class="col-xl-3">
				<div class="card card-custom card-stretch gutter-b">
					<div class="card-body">
						<span class="svg-icon svg-icon-2x svg-icon-danger">
							<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
							    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							        <rect x="0" y="0" width="24" height="24"/>
							        <circle fill="#000000" opacity="0.3" cx="12" cy="12" r="10"/>
							        <path d="M12.0355339,10.6213203 L14.863961,7.79289322 C15.2544853,7.40236893 15.8876503,7.40236893 16.2781746,7.79289322 C16.6686989,8.18341751 16.6686989,8.81658249 16.2781746,9.20710678 L13.4497475,12.0355339 L16.2781746,14.863961 C16.6686989,15.2544853 16.6686989,15.8876503 16.2781746,16.2781746 C15.8876503,16.6686989 15.2544853,16.6686989 14.863961,16.2781746 L12.0355339,13.4497475 L9.20710678,16.2781746 C8.81658249,16.6686989 8.18341751,16.6686989 7.79289322,16.2781746 C7.40236893,15.8876503 7.40236893,15.2544853 7.79289322,14.863961 L10.6213203,12.0355339 L7.79289322,9.20710678 C7.40236893,8.81658249 7.40236893,8.18341751 7.79289322,7.79289322 C8.18341751,7.40236893 8.81658249,7.40236893 9.20710678,7.79289322 L12.0355339,10.6213203 Z" fill="#000000"/>
							    </g>
							</svg>
						</span>
						<span class="card-title font-weight-bolder text-dark-75 font-size-h2 mb-0 mt-6 d-block">
							₱ <span id="VPAmount">15,000.00</span>
						</span>
						<span class="font-weight-bold font-size-h5 text-muted">Total Void Payment Amount</span>
					</div>
				</div>
			</div>

		</div>
		<!--end::Row-->

		<!--begin::Card-->
		<div class="card card-custom">
			<div class="card-header">
				<h3 class="card-title">
					Payment Details 
				</h3>
			</div>
			<div class="card-body">
				<table class="table table-bordered table-head-custom table-foot-custom table-checkable" id="tbl_payment">
					<caption style="caption-side:top" class="font-weight-bolder text-uppercase"> Payment </caption>
					<thead class="text-center">
						<tr>
							<th class="font-weight-bolder">#</th>
							<th class="font-weight-bolder">O.R. Number</th>
							<th class="font-weight-bolder">T.O.P</th>
							<th class="font-weight-bolder">Date</th>
							<th class="font-weight-bolder">Status</th>
							<th class="font-weight-bolder">Payment Amount</th>
						</tr>
					</thead>
					<tbody class="text-center">
						<tr> 
							<td> 1 </td>
							<td> 1001 </td>
							<td> 2112 </td>
							<td> Aug. 21, 2020 </td>
							<td> <span class="label label-light-success label-inline font-weight-bold label-lg"> Paid </span> </td>
							<td class="text-right"> ₱ 10,000.00 </td>
						</tr>
						<tr> 
							<td> 2 </td>
							<td> 1002 </td>
							<td> 2113 </td>
							<td> Aug. 27, 2020 </td>
							<td> <span class="label label-light-danger label-inline font-weight-bold label-lg"> Void </span> </td>
							<td class="text-right"> ₱ 15,000.00 </td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<!--end::Card-->

	</div>
	<!--end::Container-->
</div>
<!--end::Entry-->

@endsection

@section('page_scripts')
<script src="{{URL::asset('assets/plugins/custom/datatables/datatables.bundle.js?v=7.1.6')}}"></script>
<script>
	// Predefined ranges
    var start = moment().subtract(29, 'days');
    var end = moment();

    $('#dateRange').daterangepicker({
        buttonClasses: ' btn',
        applyClass: 'btn-primary',
        cancelClass: 'btn-secondary',

        startDate: start,
        endDate: end,
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, function(start, end, label) {
        $('#dateRange .form-control').val( start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
    });

    $('#dateRange .form-control').val( start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
</script>
@endsection