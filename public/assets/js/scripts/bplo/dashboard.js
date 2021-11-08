"use strict";


var _commaSeparateNumber = function(val) {
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
}

// Class definition
var KtCharts = function() {
    var verified_business_report = function() {
        $.ajax({
            url : verified_business_report_url,
            type: "post",
            success:function(res) { 
                var chart = AmCharts.makeChart("kt_amcharts_1", {
                    "rtl": KTUtil.isRTL(),
                    "type": "serial",
                    "theme": "light",
                    "dataProvider": res,
                    "valueAxes": [{
                        "gridColor": "#FFFFFF",
                        "gridAlpha": 0.2,
                        "dashLength": 0
                    }],
                    "gridAboveGraphs": true,
                    "startDuration": 1,
                    "graphs": [{
                        "balloonText": "[[category]]: <b>[[value]]</b>",
                        "fillAlphas": 0.8,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": "count"
                    }],
                    "chartCursor": {
                        "categoryBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "zoomable": false
                    },
                    "categoryField": "year",
                    "categoryAxis": {
                        "gridPosition": "start",
                        "gridAlpha": 0,
                        "tickPosition": "start",
                        "tickLength": 20
                    },
                    "export": {
                        "enabled": true
                    }

                });
            },
            error:function(a,b,c)
            {
                forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
            }
        })
  
    }
    var buss_brgy_report = function () {
        $.ajax({
            url : buss_brgy_report_url,
            type: "post",
            success:function(res) { 
              
                $.each(res.brgy_list_summary, function(index, value){
                    $('#brgy_list').append(`
                            <tr style="border-bottom:none !important">
                                <td class="font-size-sm" style="border-top:none !important">`+value.buss_brgy+`</td>
                                <td class="font-size-sm" style="border-top:none !important">`+_commaSeparateNumber(value.count)+`</td>
                            </tr>
                        `);
                })
            
                    var element = document.getElementById("buss_brgy_report");
                    var color = KTUtil.hasAttr(element, 'data-color') ? KTUtil.attr(element, 'data-color') : 'warning';
                    var height = parseInt(KTUtil.css(element, 'height'));

                    if (!element) {
                        return;
                    }

                    var options = {
                        series: [{
                            name: 'Business',
                            data: res.count
                        }],
                        chart: {
                            type: 'area',
                            height: height,
                            toolbar: {
                                show: false
                            },
                            zoom: {
                                enabled: false
                            },
                            sparkline: {
                                enabled: true
                            }
                        },
                        plotOptions: {},
                        legend: {
                            show: false
                        },
                        dataLabels: {
                            enabled: false
                        },
                        fill: {
                            type: 'solid',
                            opacity: 1
                        },
                        stroke: {
                            curve: 'smooth',
                            show: true,
                            width: 3,
                            colors: [KTApp.getSettings()['colors']['theme']['base'][color]]
                        },
                        xaxis: {
                            categories: res.brgy_list,
                            axisBorder: {
                                show: false,
                            },
                            axisTicks: {
                                show: false
                            },
                            labels: {
                                show: false,
                                style: {
                                    colors: KTApp.getSettings()['colors']['gray']['gray-500'],
                                    fontSize: '12px',
                                    fontFamily: KTApp.getSettings()['font-family']
                                }
                            },
                            crosshairs: {
                                show: false,
                                position: 'front',
                                stroke: {
                                    color: KTApp.getSettings()['colors']['gray']['gray-300'],
                                    width: 1,
                                    dashArray: 3
                                }
                            },
                            tooltip: {
                                enabled: true,
                                formatter: undefined,
                                offsetY: 0,
                                style: {
                                    fontSize: '12px',
                                    fontFamily: KTApp.getSettings()['font-family']
                                }
                            }
                        },
                        yaxis: {
                            min: 0,
                            max: 60,
                            labels: {
                                show: false,
                                style: {
                                    colors: KTApp.getSettings()['colors']['gray']['gray-500'],
                                    fontSize: '12px',
                                    fontFamily: KTApp.getSettings()['font-family']
                                }
                            }
                        },
                        states: {
                            normal: {
                                filter: {
                                    type: 'none',
                                    value: 0
                                }
                            },
                            hover: {
                                filter: {
                                    type: 'none',
                                    value: 0
                                }
                            },
                            active: {
                                allowMultipleDataPointsSelection: false,
                                filter: {
                                    type: 'none',
                                    value: 0
                                }
                            }
                        },
                        tooltip: {
                            style: {
                                fontSize: '12px',
                                fontFamily: KTApp.getSettings()['font-family']
                            },
                            y: {
                                formatter: function (val) {
                                    return  val
                                }
                            }
                        },
                        colors: [KTApp.getSettings()['colors']['theme']['light'][color]],
                        markers: {
                            colors: [KTApp.getSettings()['colors']['theme']['light'][color]],
                            strokeColor: [KTApp.getSettings()['colors']['theme']['base'][color]],
                            strokeWidth: 3
                        }
                    };

                    var chart = new ApexCharts(element, options);
                    chart.render();
            },
            error:function(a,b,c)
            {
                forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
            }
        })
       
    }

    var other_reports = function () {
        $.ajax({
            url : business_process_report_url,
            type: "post",
            success:function(res) { 
            
                console.log(res);
                var closing_count = res.closing_count / 100;
                var reassessment_count = res.reassessment_count  / 100;
                var new_count = res.new_count / 100;
                var renew_count = res. renew_count / 100;
                var special_count = res.special_count / 100;
                var element = document.getElementById("assessment_type_report");
                var height = parseInt(KTUtil.css(element, 'height'));

                if (!element) {
                    return;
                }

                var options = {
                    series: [closing_count, reassessment_count, new_count, renew_count, special_count],
                    chart: {
                        height: height,
                        type: 'radialBar',
                    },
                    plotOptions: {
                        radialBar: {
                            hollow: {
                                margin: 0,
                                size: "30%"
                            },
                            dataLabels: {
                                showOn: "always",
                                name: {
                                    show: true,
                                    fontWeight: "700",
                                },
                                value: {
                                    color: KTApp.getSettings()['colors']['gray']['gray-700'],
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    offsetY: 10,
                                    show: true
                                }
                            },
                            track: {
                                background: KTApp.getSettings()['colors']['gray']['gray-100'],
                                strokeWidth: '100%'
                            }
                        }
                    },
                    colors: [
                        KTApp.getSettings()['colors']['theme']['base']['success'],
                        KTApp.getSettings()['colors']['theme']['base']['warning'],
                        KTApp.getSettings()['colors']['theme']['base']['info'],
                        KTApp.getSettings()['colors']['theme']['base']['primary'],
                        KTApp.getSettings()['colors']['theme']['base']['danger']

                    ],
                    stroke: {
                        lineCap: "round",
                    },
                    labels: ["Closure","Reassessment", "New", "Renew", "Special"]
                };

                var chart = new ApexCharts(element, options);
                chart.render();
            },
            error:function(a,b,c)
            {
                forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
            }
        })
       
    }

    var monthly_verified_report = function () {

         $.ajax({
            url : verified_monthly_business_report_url,
            type: "post",
            success:function(res) { 
             console.log(res);
                var element = document.getElementById("monthly_verfied_business_report");

                if (!element) {
                    return;
                }

                var options = {
                    series: [{
                        name: 'Total',
                        data: res.count
                    }],
                    chart: {
                        type: 'area',
                        height: 350,
                        toolbar: {
                            show: false
                        }
                    },
                    plotOptions: {

                    },
                    legend: {
                        show: false
                    },
                    dataLabels: {
                        enabled: false
                    },
                    fill: {
                        type: 'solid',
                        opacity: 1
                    },
                    stroke: {
                        curve: 'smooth',
                        show: true,
                        width: 3,
                        colors: [KTApp.getSettings()['colors']['theme']['base']['info']]
                    },
                    xaxis: {
                        categories: res.month,
                        axisBorder: {
                            show: false,
                        },
                        axisTicks: {
                            show: false
                        },
                        labels: {
                            style: {
                                colors: KTApp.getSettings()['colors']['gray']['gray-500'],
                                fontSize: '12px',
                                fontFamily: KTApp.getSettings()['font-family']
                            }
                        },
                        crosshairs: {
                            position: 'front',
                            stroke: {
                                color: KTApp.getSettings()['colors']['theme']['base']['info'],
                                width: 1,
                                dashArray: 3
                            }
                        },
                        tooltip: {
                            enabled: true,
                            formatter: undefined,
                            offsetY: 0,
                            style: {
                                fontSize: '12px',
                                fontFamily: KTApp.getSettings()['font-family']
                            }
                        }
                    },
                    yaxis: {
                        labels: {
                            style: {
                                colors: KTApp.getSettings()['colors']['gray']['gray-500'],
                                fontSize: '12px',
                                fontFamily: KTApp.getSettings()['font-family']
                            }
                        }
                    },
                    states: {
                        normal: {
                            filter: {
                                type: 'none',
                                value: 0
                            }
                        },
                        hover: {
                            filter: {
                                type: 'none',
                                value: 0
                            }
                        },
                        active: {
                            allowMultipleDataPointsSelection: false,
                            filter: {
                                type: 'none',
                                value: 0
                            }
                        }
                    },
                    tooltip: {
                        style: {
                            fontSize: '12px',
                            fontFamily: KTApp.getSettings()['font-family']
                        },
                        y: {
                            formatter: function (val) {
                                return _commaSeparateNumber(val)
                            }
                        }
                    },
                    colors: [KTApp.getSettings()['colors']['theme']['light']['info']],
                    grid: {
                        borderColor: KTApp.getSettings()['colors']['gray']['gray-200'],
                        strokeDashArray: 4,
                        yaxis: {
                            lines: {
                                show: true
                            }
                        }
                    },
                    markers: {
                        //size: 5,
                        //colors: [KTApp.getSettings()['colors']['theme']['light']['danger']],
                        strokeColor: KTApp.getSettings()['colors']['theme']['base']['info'],
                        strokeWidth: 3
                    }
                };

                var chart = new ApexCharts(element, options);
                chart.render();
            },
            error:function(a,b,c)
            {
                forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
            }
        })
        
    }

    return {
        // public functions
        init: function() {
            buss_brgy_report();
            other_reports();
            verified_business_report();
            monthly_verified_report();
        }
    };
}();

jQuery(document).ready(function() {
    KtCharts.init();
});