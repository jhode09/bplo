"use strict";


var _commaSeparateNumber = function(val) {
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
}

// Class definition
var KtCharts = function() {



    var inspect_report = function() {
        $.ajax({
            url : inspection_report_url,
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
    var risk_report = function() {
        $.ajax({
            url : risk_report_url,
            type: "post",
            success:function(res) { 
                var chart = AmCharts.makeChart("kt_amcharts_12", {
                    "type": "pie",
                    "theme": "light",
                    "colors": ["#F64E60", "#FFA800", "#1BC5BD"],
                    "dataProvider": [{
                        "type": "High Risk",
                        "count": res.total_high
                    }, {
                        "type": "Medium Risk",
                        "count": res.total_medium
                    }, {
                        "type": "Low Risk",
                        "count": res.total_low
                    }],
                    "valueField": "count",
                    "titleField": "type",
                    "balloon": {
                        "fixedPosition": true
                    },
                    "export": {
                        "enabled": true
                    },
                    
                });
            },
            error:function(a,b,c)
            {
                forSwal("An error occured. Please contact the admin.", "error", "btn-danger");
            }
        })
  
    }

    var compliance_report = function () {
        $.ajax({
            url : compliance_report_url,
            type: "post",
            success:function(res) { 
                
                $('#noncompliance_count').text(_commaSeparateNumber(res.noncompliance_count));
                $('#compliance_count').text(_commaSeparateNumber(res.complied_count));

                var noncompliance_count = res.noncompliance_count / 100;
                var complied_count = res.complied_count / 100;
                var element = document.getElementById("compliance_report");
                var height = parseInt(KTUtil.css(element, 'height'));

                if (!element) {
                    return;
                }

                var options = {
                    series: [noncompliance_count, complied_count],
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
                                    fontSize: "14px",
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
                        KTApp.getSettings()['colors']['theme']['base']['warning']
                    ],
                    stroke: {
                        lineCap: "round",
                    },
                    labels: ["Non-Compliance","Complied"]
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



    return {
        // public functions
        init: function() {
            inspect_report();
            risk_report();
            compliance_report();
            buss_brgy_report();
        }
    };
}();

jQuery(document).ready(function() {
    KtCharts.init();
});