@extends('layouts.guest_master')
@section('title') Assessment History @endsection

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
						<a href="" class="text-muted">Assessment History</a>
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
		<!--begin::Card-->
		<div class="card card-custom">
			<div class="card-header">
				<h3 class="card-title">
					Assesment Details 
				</h3>
			</div>
			<div class="card-body">
				<div class="row">
					<div class="col-lg-12">
						<table class="table table-bordered table-head-custom table-foot-custom table-checkable" id="tbl_payment">
							<caption style="caption-side:top" class="font-weight-bolder text-uppercase"> Assessment </caption>
							<thead class="text-center">
								<tr>
									<th class="font-weight-bolder">#</th>
									<th class="font-weight-bolder">T.O.P</th>
									<th class="font-weight-bolder">Assessment Date</th>
									<th class="font-weight-bolder">Status</th>
									<th class="font-weight-bolder">Total Amount</th>
									<th>Assessment Details</th>
								</tr>
							</thead>
							<tbody class="text-center">
								<tr> 
									<td> 1 </td>
									<td> 1202 </td>
									<td> Aug. 21, 2020 </td>
									<td> <span class="label label-light-success label-inline font-weight-bold label-lg"> Processed </span> </td>
									<td class="text-right"> ₱ 10,000.00 </td>
									<td> 
										<a type="button" 
											class="btn btn-sm btn-icon btn-light-primary" 
											data-container="body"
											data-toggle="tooltip"
											data-placement="top"
											title="View Assessment Details"
										>
											<i class="flaticon-notepad"></i>
										</a> 
									</td>
								</tr>
								<tr> 
									<td> 2 </td>
									<td> 1002 </td>
									<td> Aug. 27, 2020 </td>
									<td> <span class="label label-light-danger label-inline font-weight-bold label-lg"> Unprocessed </span> </td>
									<td class="text-right"> ₱ 15,000.00 </td>
									<td> 
										<a type="button" 
											class="btn btn-sm btn-icon btn-light-primary" 
											data-container="body"
											data-toggle="tooltip"
											data-placement="top"
											title="View Assessment Details"
										>
											<i class="flaticon-notepad"></i>
										</a> 
									</td>
								</tr>
							</tbody>
						</table>
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