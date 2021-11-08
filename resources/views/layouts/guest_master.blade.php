
<!DOCTYPE html>
<html lang="en">
	<!--begin::Head-->
	<head>
		<meta charset="utf-8" />
		<title>@yield('title') | Cabuyao BPLO</title>
		<meta name="description" content="Updates and statistics" />
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
		<meta name="csrf-token" content="{{ csrf_token() }}">
		
		<link href="{{URL::asset('assets/plugins/global/plugins.bundle.css?v=7.1.8')}}" rel="stylesheet" type="text/css" />
		<link href="{{URL::asset('assets/plugins/custom/prismjs/prismjs.bundle.css?v=7.1.8')}}" rel="stylesheet" type="text/css" />
		<link href="{{URL::asset('assets/css/style.bundle.css?v=7.1.8')}}" rel="stylesheet" type="text/css" />
		<link rel="shortcut icon" href="{{URL::asset('assets/media/logos/logo.png')}}" />
		<!-- <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700" /> -->
		<link href="{{URL::asset('assets/plugins/custom/fullcalendar/fullcalendar.bundle.css?v=7.1.8')}}" rel="stylesheet" type="text/css" />


		<style>
            #loader {
                position:fixed;
                width:100%;
                left:0;right:0;top:0;bottom:0;
                background-color: rgba(255,255,255,0.7);
                z-index:9999;
                display:none;
                padding-top: 13%;
            }

            #loader img {
                width: 150px;
                height: 150px;
            }

            .loader-progress {
                width: 50% !important;
            }

            #body_loader {
                position:fixed;
                width:100%;
                left:0;right:0;top:0;bottom:0;
                background-color: rgba(255,255,255,0.7);
                z-index:9999;
                display:show;
                padding-top: 13%;
            }

            #main_content {
                display: none;
            }
        </style>

        @yield('header_links')
	</head>
	<!--end::Head-->

	<!--begin::Loaders-->
		@include('layouts/includes_guest.loaders')
	<!--end::Loaders-->

	<!--begin::Body-->
	<body id="kt_body" class="page-loading-enabled page-loading header-fixed header-mobile-fixed page-loading">
		<noscript>
			<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5FS8GGP" height="0" width="0" style="display:none;visibility:hidden"></iframe>
		</noscript>

		<!--begin::Main-->

			<!--begin::Header Mobile-->
				@include('layouts/includes_guest.header-mobile')
			<!--end::Header Mobile-->

			<div class="d-flex flex-column flex-root">
				<div class="d-flex flex-row flex-column-fluid page">
					<div class="d-flex flex-column flex-row-fluid wrapper" id="kt_wrapper">

						<!--begin::Header-->
							@include('layouts/includes_guest.header_backup')
						<!--end::Header-->

						<!--begin::Content-->
						<div class="content d-flex flex-column flex-column-fluid" id="kt_content">
							@yield('content')
						</div>
						<!--end::Content-->

						<!--begin::Footer-->
							@include('layouts/includes_guest.footer')
						<!--end::Footer-->

					</div>
				</div>
			</div>

		<!--end::Main-->

		<!-- begin::Panels-->
			@include('layouts/includes_guest.panels')
		<!-- end::Panels-->

		<!-- Modal-->
		<div class="modal" id="sessionModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
		    <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
		        <div class="modal-content">
		            <div class="modal-header">
		                <h5 class="modal-title" id="exampleModalLabel">Session Timeout</h5>
		            </div>
		            <div class="modal-body">
			            <div class="form-group text-center">
			                <span class="font-weight-bolder font-size-h4">
			                	Your session has expired. Please login again. Thank you. <br> <br>
			                	<a href="{{ route('user.login') }}" class="btn btn-primary">
			                		Ok, Got it.
			                	</a>
			                </span>
			            </div>
		            </div>
		        </div>
		    </div>
		</div>
		<!-- Modal-->

		<script>
			var KTAppSettings = { 
				"breakpoints": { 
					"sm"  : 576, 
					"md"  : 768, 
					"lg"  : 992, 
					"xl"  : 1200, 
					"xxl" : 1200 
				}, 
				"colors": { 
					"theme": { 
						"base": { 
							"white"		: "#ffffff", 
							"primary"	: "#0BB783", 
							"secondary"	: "#E5EAEE", 
							"success"	: "#1BC5BD", 
							"info"		: "#8950FC", 
							"warning"	: "#FFA800", 
							"danger"	: "#F64E60", 
							"light"		: "#F3F6F9", 
							"dark"		: "#212121" 
						}, 
						"light": { 
							"white"		: "#ffffff", 
							"primary"	: "#D7F9EF", 
							"secondary"	: "#ECF0F3", 
							"success"	: "#C9F7F5", 
							"info"		: "#EEE5FF", 
							"warning"	: "#FFF4DE", 
							"danger"	: "#FFE2E5", 
							"light"		: "#F3F6F9", 
							"dark"		: "#D6D6E0" 
						}, 
						"inverse": { 
							"white"		: "#ffffff", 
							"primary"	: "#ffffff", 
							"secondary"	: "#212121", 
							"success"	: "#ffffff", 
							"info"		: "#ffffff", 
							"warning"	: "#ffffff", 
							"danger"	: "#ffffff", 
							"light"		: "#464E5F", 
							"dark"		: "#ffffff" 
						} 
					}, 
					"gray": { 
						"gray-100" : "#F3F6F9", 
						"gray-200" : "#ECF0F3", 
						"gray-300" : "#E5EAEE", 
						"gray-400" : "#D6D6E0", 
						"gray-500" : "#B5B5C3", 
						"gray-600" : "#80808F", 
						"gray-700" : "#464E5F", 
						"gray-800" : "#1B283F", 
						"gray-900" : "#212121" 
					} 
				}, 
				"font-family": "Poppins" 
			};
			var login_url = "{{ route('user.login') }}";
		</script>

		<script src="{{URL::asset('assets/plugins/global/plugins.bundle.js?v=7.1.8')}}"></script>
		<script src="{{URL::asset('assets/plugins/custom/prismjs/prismjs.bundle.js?v=7.1.8')}}"></script>
		<script src="{{URL::asset('assets/js/scripts.bundle.js?v=7.1.8')}}"></script>
		<script type="text/javascript" src="{{URL::asset('assets/js/utilities.js')}}"></script>
		<script src="{{URL::asset('assets/plugins/custom/fullcalendar/fullcalendar.bundle.js?v=7.1.8')}}"></script>
		
		@yield('page_scripts')
	</body>
	<!--end::Body-->

</html>