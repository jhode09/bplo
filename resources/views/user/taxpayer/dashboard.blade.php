@extends('layouts.guest_master')
@section('title') Dashboard @endsection

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
				<h2 class="d-flex align-items-center text-dark font-weight-bold my-1 mr-3"> Dashboard </h2>
			</div>
		</div>
	</div>
</div>
<!--end::Subheader-->

<!--begin::Entry-->
<div class="d-flex flex-column-fluid">
	<div class="container-fluid">
		<div class="row mt-0 mt-lg-3">
			<div class="col-xl-4">
				<div class="card card-custom gutter-b card-stretch">
					<div class="card-header border-0 pt-5">
						<div class="card-title font-weight-bolder">
							<div class="card-label font-weight-bolder text-dark">Recent Payments</div>
						</div>
					</div>
					<div class="card-body p-0 d-flex flex-column">
						<div class="flex-grow-1 card-spacer">
							<div class="row row-paddingless mt-5 mb-10">
								<div class="col">
									<div class="d-flex align-items-center mr-2">
										<div class="symbol symbol-45 symbol-light-info mr-4 flex-shrink-0">
											<div class="symbol-label">
												<span class="svg-icon svg-icon-lg svg-icon-info">
													<svg height="24px" viewBox="0 0 24 24" version="1.1">
													    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
													        <rect x="0" y="0" width="24" height="24"/>
													        <path d="M2,6 L21,6 C21.5522847,6 22,6.44771525 22,7 L22,17 C22,17.5522847 21.5522847,18 21,18 L2,18 C1.44771525,18 1,17.5522847 1,17 L1,7 C1,6.44771525 1.44771525,6 2,6 Z M11.5,16 C13.709139,16 15.5,14.209139 15.5,12 C15.5,9.790861 13.709139,8 11.5,8 C9.290861,8 7.5,9.790861 7.5,12 C7.5,14.209139 9.290861,16 11.5,16 Z" fill="#000000" opacity="0.3" transform="translate(11.500000, 12.000000) rotate(-345.000000) translate(-11.500000, -12.000000) "/>
													        <path d="M2,6 L21,6 C21.5522847,6 22,6.44771525 22,7 L22,17 C22,17.5522847 21.5522847,18 21,18 L2,18 C1.44771525,18 1,17.5522847 1,17 L1,7 C1,6.44771525 1.44771525,6 2,6 Z M11.5,16 C13.709139,16 15.5,14.209139 15.5,12 C15.5,9.790861 13.709139,8 11.5,8 C9.290861,8 7.5,9.790861 7.5,12 C7.5,14.209139 9.290861,16 11.5,16 Z M11.5,14 C12.6045695,14 13.5,13.1045695 13.5,12 C13.5,10.8954305 12.6045695,10 11.5,10 C10.3954305,10 9.5,10.8954305 9.5,12 C9.5,13.1045695 10.3954305,14 11.5,14 Z" fill="#000000"/>
													    </g>
													</svg>
												</span>
											</div>
										</div>
										<div>
											<div class="font-size-h4 text-dark-75 font-weight-bolder">₱ 10,000</div>
											<div class="font-size-sm text-muted font-weight-bold mt-1">Aug. 21, 2020</div>
										</div>
									</div>
								</div>
								<div class="col">
									<div class="d-flex align-items-center mr-2">
										<div class="symbol symbol-45 symbol-light-info mr-4 flex-shrink-0">
											<div class="symbol-label">
												<span class="svg-icon svg-icon-lg svg-icon-info">
													<svg height="24px" viewBox="0 0 24 24" version="1.1">
													    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
													        <rect x="0" y="0" width="24" height="24"/>
													        <path d="M2,6 L21,6 C21.5522847,6 22,6.44771525 22,7 L22,17 C22,17.5522847 21.5522847,18 21,18 L2,18 C1.44771525,18 1,17.5522847 1,17 L1,7 C1,6.44771525 1.44771525,6 2,6 Z M11.5,16 C13.709139,16 15.5,14.209139 15.5,12 C15.5,9.790861 13.709139,8 11.5,8 C9.290861,8 7.5,9.790861 7.5,12 C7.5,14.209139 9.290861,16 11.5,16 Z" fill="#000000" opacity="0.3" transform="translate(11.500000, 12.000000) rotate(-345.000000) translate(-11.500000, -12.000000) "/>
													        <path d="M2,6 L21,6 C21.5522847,6 22,6.44771525 22,7 L22,17 C22,17.5522847 21.5522847,18 21,18 L2,18 C1.44771525,18 1,17.5522847 1,17 L1,7 C1,6.44771525 1.44771525,6 2,6 Z M11.5,16 C13.709139,16 15.5,14.209139 15.5,12 C15.5,9.790861 13.709139,8 11.5,8 C9.290861,8 7.5,9.790861 7.5,12 C7.5,14.209139 9.290861,16 11.5,16 Z M11.5,14 C12.6045695,14 13.5,13.1045695 13.5,12 C13.5,10.8954305 12.6045695,10 11.5,10 C10.3954305,10 9.5,10.8954305 9.5,12 C9.5,13.1045695 10.3954305,14 11.5,14 Z" fill="#000000"/>
													    </g>
													</svg>
													<!--end::Svg Icon-->
												</span>
											</div>
										</div>
										<div>
											<div class="font-size-h4 text-dark-75 font-weight-bolder">₱ 10,000</div>
											<div class="font-size-sm text-muted font-weight-bold mt-1">Apr. 1, 2020</div>
										</div>
									</div>
								</div>
							</div>
							<div class="row row-paddingless">
								<div class="col">
									<div class="d-flex align-items-center mr-2">
										<div class="symbol symbol-45 symbol-light-info mr-4 flex-shrink-0">
											<div class="symbol-label">
												<span class="svg-icon svg-icon-lg svg-icon-info">
													<svg height="24px" viewBox="0 0 24 24" version="1.1">
													    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
													        <rect x="0" y="0" width="24" height="24"/>
													        <path d="M2,6 L21,6 C21.5522847,6 22,6.44771525 22,7 L22,17 C22,17.5522847 21.5522847,18 21,18 L2,18 C1.44771525,18 1,17.5522847 1,17 L1,7 C1,6.44771525 1.44771525,6 2,6 Z M11.5,16 C13.709139,16 15.5,14.209139 15.5,12 C15.5,9.790861 13.709139,8 11.5,8 C9.290861,8 7.5,9.790861 7.5,12 C7.5,14.209139 9.290861,16 11.5,16 Z" fill="#000000" opacity="0.3" transform="translate(11.500000, 12.000000) rotate(-345.000000) translate(-11.500000, -12.000000) "/>
													        <path d="M2,6 L21,6 C21.5522847,6 22,6.44771525 22,7 L22,17 C22,17.5522847 21.5522847,18 21,18 L2,18 C1.44771525,18 1,17.5522847 1,17 L1,7 C1,6.44771525 1.44771525,6 2,6 Z M11.5,16 C13.709139,16 15.5,14.209139 15.5,12 C15.5,9.790861 13.709139,8 11.5,8 C9.290861,8 7.5,9.790861 7.5,12 C7.5,14.209139 9.290861,16 11.5,16 Z M11.5,14 C12.6045695,14 13.5,13.1045695 13.5,12 C13.5,10.8954305 12.6045695,10 11.5,10 C10.3954305,10 9.5,10.8954305 9.5,12 C9.5,13.1045695 10.3954305,14 11.5,14 Z" fill="#000000"/>
													    </g>
													</svg>
													<!--end::Svg Icon-->
												</span>
											</div>
										</div>
										<div>
											<div class="font-size-h4 text-dark-75 font-weight-bolder">₱ 10,000</div>
											<div class="font-size-sm text-muted font-weight-bold mt-1">Aug. 1, 2020</div>
										</div>
									</div>
								</div>
								<div class="col">
									<div class="d-flex align-items-center mr-2">
										<div class="symbol symbol-45 symbol-light-info mr-4 flex-shrink-0">
											<div class="symbol-label">
												<span class="svg-icon svg-icon-lg svg-icon-info">
													<svg height="24px" viewBox="0 0 24 24" version="1.1">
													    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
													        <rect x="0" y="0" width="24" height="24"/>
													        <path d="M2,6 L21,6 C21.5522847,6 22,6.44771525 22,7 L22,17 C22,17.5522847 21.5522847,18 21,18 L2,18 C1.44771525,18 1,17.5522847 1,17 L1,7 C1,6.44771525 1.44771525,6 2,6 Z M11.5,16 C13.709139,16 15.5,14.209139 15.5,12 C15.5,9.790861 13.709139,8 11.5,8 C9.290861,8 7.5,9.790861 7.5,12 C7.5,14.209139 9.290861,16 11.5,16 Z" fill="#000000" opacity="0.3" transform="translate(11.500000, 12.000000) rotate(-345.000000) translate(-11.500000, -12.000000) "/>
													        <path d="M2,6 L21,6 C21.5522847,6 22,6.44771525 22,7 L22,17 C22,17.5522847 21.5522847,18 21,18 L2,18 C1.44771525,18 1,17.5522847 1,17 L1,7 C1,6.44771525 1.44771525,6 2,6 Z M11.5,16 C13.709139,16 15.5,14.209139 15.5,12 C15.5,9.790861 13.709139,8 11.5,8 C9.290861,8 7.5,9.790861 7.5,12 C7.5,14.209139 9.290861,16 11.5,16 Z M11.5,14 C12.6045695,14 13.5,13.1045695 13.5,12 C13.5,10.8954305 12.6045695,10 11.5,10 C10.3954305,10 9.5,10.8954305 9.5,12 C9.5,13.1045695 10.3954305,14 11.5,14 Z" fill="#000000"/>
													    </g>
													</svg>
													<!--end::Svg Icon-->
												</span>
											</div>
										</div>
										<div>
											<div class="font-size-h4 text-dark-75 font-weight-bolder">₱ 10,000</div>
											<div class="font-size-sm text-muted font-weight-bold mt-1">Dec. 1, 2020</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div id="kt_mixed_widget_17_chart" class="card-rounded-bottom" data-color="primary" style="height: 200px"></div>
					</div>
				</div>
			</div>

			<div class="col-xl-4">
				<div class="card card-custom gutter-b card-stretch">
					<div class="card-header align-items-center border-0 mt-4">
						<h3 class="card-title align-items-start flex-column">
							<span class="font-weight-bolder text-dark">
								Business Process Tracking <span class="text-muted ml-2">Year - 2021</span>
							</span>
						</h3>
					</div>
					<div class="card-body pt-4">
						<div class="timeline timeline-6 mt-3">
							<div class="timeline-item align-items-start">
								<div class="timeline-label font-weight-bolder text-muted-75 font-size-sm">Jan. 21</div>
								<div class="timeline-badge">
									<i class="fa fa-genderless text-success icon-xl"></i>
								</div>
								<div class="timeline-content d-flex">
									<span class="font-weight-bolder text-dark-75 pl-3 font-size-lg">Your renewal business process has been created</span>
								</div>
							</div>
							
							<div class="timeline-item align-items-start">
								<div class="timeline-label font-weight-bolder text-dark-75 font-size-sm">Jan. 21</div>
								<div class="timeline-badge">
									<i class="fa fa-genderless text-warning icon-xl"></i>
								</div>
								<div class="timeline-content d-flex">
									<span class="font-weight-bolder text-dark-75 pl-3 font-size-lg">Cenro assessment is now processing</span>
								</div>
							</div>
							
							<div class="timeline-item align-items-start">
								<div class="timeline-label font-weight-bolder text-dark-75 font-size-sm">Jan. 21</div>
								<div class="timeline-badge">
									<i class="fa fa-genderless text-warning icon-xl"></i>
								</div>
								<div class="timeline-content d-flex">
									<span class="font-weight-bolder text-dark-75 pl-3 font-size-lg">Engineering assessment is now processing</span>
								</div>
							</div>
							
							<div class="timeline-item align-items-start">
								<div class="timeline-label font-weight-bolder text-dark-75 font-size-sm">Jan. 21</div>
								<div class="timeline-badge">
									<i class="fa fa-genderless text-warning icon-xl"></i>
								</div>
								<div class="timeline-content d-flex">
									<span class="font-weight-bolder text-dark-75 pl-3 font-size-lg">Sanitary assessment is now processing</span>
								</div>
							</div>
							
							<div class="timeline-item align-items-start">
								<div class="timeline-label font-weight-bolder text-dark-75 font-size-sm">Jan. 21</div>
								<div class="timeline-badge">
									<i class="fa fa-genderless text-success icon-xl"></i>
								</div>
								<div class="timeline-content d-flex">
									<span class="font-weight-bolder text-dark-75 pl-3 font-size-lg">Cenro assessment is done</span>
								</div>
							</div>
							
							<div class="timeline-item align-items-start">
								<div class="timeline-label font-weight-bolder text-dark-75 font-size-sm">Jan. 22</div>
								<div class="timeline-badge">
									<i class="fa fa-genderless text-success icon-xl"></i>
								</div>
								<div class="timeline-content d-flex">
									<span class="font-weight-bolder text-dark-75 pl-3 font-size-lg">Engineering assessment is done</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="col-xl-4">
				<div class="card card-custom card-stretch gutter-b">
					<div class="card-header border-0">
						<h3 class="card-title font-weight-bolder text-dark">Assessment History</h3>
					</div>
					<div class="card-body pt-2">
						<div class="d-flex align-items-center mt-10">
							<span class="bullet bullet-bar bg-primary align-self-stretch mr-5"></span>
							<label class="checkbox checkbox-lg checkbox-light-primary checkbox-inline flex-shrink-0 m-0 mx-4">
								<input type="checkbox" disabled/>
								<span></span>
							</label>
							<div class="d-flex flex-column flex-grow-1">
								<a href="#" class="text-dark-75 text-hover-primary font-weight-bolder font-size-lg mb-1">T.O.P # 1202</a>
								<span class="text-muted font-weight-bold">Created Date: Jan. 20, 2021</span>
							</div>
						</div>
						<div class="d-flex align-items-center mt-10">
							<span class="bullet bullet-bar bg-warning align-self-stretch mr-5"></span>
							<label class="checkbox checkbox-lg checkbox-light-warning checkbox-inline flex-shrink-0 m-0 mx-4">
								<input type="checkbox" disabled/>
								<span></span>
							</label>
							<div class="d-flex flex-column flex-grow-1">
								<a href="#" class="text-dark-75 text-hover-primary font-weight-bolder font-size-lg mb-1">T.O.P # 1002</a>
								<span class="text-muted font-weight-bold">Created Date: Jan. 20, 2020</span>
							</div>
						</div>
						<div class="d-flex align-items-center mt-10">
							<span class="bullet bullet-bar bg-warning align-self-stretch mr-5"></span>
							<label class="checkbox checkbox-lg checkbox-light-warning checkbox-inline flex-shrink-0 m-0 mx-4">
								<input type="checkbox" disabled/>
								<span></span>
							</label>
							<div class="d-flex flex-column flex-grow-1">
								<a href="#" class="text-dark-75 text-hover-primary font-weight-bolder font-size-lg mb-1">T.O.P # 992</a>
								<span class="text-muted font-weight-bold">Created Date: Jan. 20, 2019</span>
							</div>
						</div>
						<div class="d-flex align-items-center mt-10">
							<span class="bullet bullet-bar bg-danger align-self-stretch mr-5"></span>
							<label class="checkbox checkbox-lg checkbox-light-danger checkbox-inline flex-shrink-0 m-0 mx-4">
								<input type="checkbox" disabled/>
								<span></span>
							</label>
							<div class="d-flex flex-column flex-grow-1">
								<a href="#" class="text-dark-75 text-hover-primary font-weight-bolder font-size-lg mb-1">T.O.P # 892</a>
								<span class="text-muted font-weight-bold">Created Date: Jan. 20, 2018</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<!--end::Entry-->
@endsection
@section('page_scripts')
<script src="{{URL::asset('assets/js/pages/widgets.js?v=7.2.8')}}"></script>
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