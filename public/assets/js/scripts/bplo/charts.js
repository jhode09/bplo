"use strict";

// Class definition
var KTamChartsChartsDemo = function() {

    // Private functions
    var demo1 = function() {
        var chart = AmCharts.makeChart("kt_amcharts_1", {
            "rtl": KTUtil.isRTL(),
            "type": "serial",
            "theme": "light",
            "dataProvider": [{
                "country": "USA",
                "visits": 2025
            }, {
                "country": "China",
                "visits": 1882
            }, {
                "country": "Japan",
                "visits": 1809
            }, {
                "country": "Germany",
                "visits": 1322
            }, {
                "country": "UK",
                "visits": 1122
            }, {
                "country": "France",
                "visits": 1114
            }, {
                "country": "India",
                "visits": 984
            }, {
                "country": "Spain",
                "visits": 711
            }, {
                "country": "Netherlands",
                "visits": 665
            }, {
                "country": "Russia",
                "visits": 580
            }, {
                "country": "South Korea",
                "visits": 443
            }, {
                "country": "Canada",
                "visits": 441
            }, {
                "country": "Brazil",
                "visits": 395
            }],
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
                "valueField": "visits"
            }],
            "chartCursor": {
                "categoryBalloonEnabled": false,
                "cursorAlpha": 0,
                "zoomable": false
            },
            "categoryField": "country",
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
    }

    var demo2 = function() {
        var chart = AmCharts.makeChart("kt_amcharts_2", {
            "rtl": KTUtil.isRTL(),
            "type": "serial",
            "addClassNames": true,
            "theme": "light",
            "autoMargins": false,
            "marginLeft": 30,
            "marginRight": 8,
            "marginTop": 10,
            "marginBottom": 26,
            "balloon": {
                "adjustBorderColor": false,
                "horizontalPadding": 10,
                "verticalPadding": 8,
                "color": "#ffffff"
            },

            "dataProvider": [{
                "year": 2009,
                "income": 23.5,
                "expenses": 21.1
            }, {
                "year": 2010,
                "income": 26.2,
                "expenses": 30.5
            }, {
                "year": 2011,
                "income": 30.1,
                "expenses": 34.9
            }, {
                "year": 2012,
                "income": 29.5,
                "expenses": 31.1
            }, {
                "year": 2013,
                "income": 30.6,
                "expenses": 28.2,
                "dashLengthLine": 5
            }, {
                "year": 2014,
                "income": 34.1,
                "expenses": 32.9,
                "dashLengthColumn": 5,
                "alpha": 0.2,
                "additional": "(projection)"
            }],
            "valueAxes": [{
                "axisAlpha": 0,
                "position": "left"
            }],
            "startDuration": 1,
            "graphs": [{
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                "fillAlphas": 1,
                "title": "Income",
                "type": "column",
                "valueField": "income",
                "dashLengthField": "dashLengthColumn"
            }, {
                "id": "graph2",
                "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                "bullet": "round",
                "lineThickness": 3,
                "bulletSize": 7,
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "useLineColorForBulletBorder": true,
                "bulletBorderThickness": 3,
                "fillAlphas": 0,
                "lineAlpha": 1,
                "title": "Expenses",
                "valueField": "expenses",
                "dashLengthField": "dashLengthLine"
            }],
            "categoryField": "year",
            "categoryAxis": {
                "gridPosition": "start",
                "axisAlpha": 0,
                "tickLength": 0
            },
            "export": {
                "enabled": true
            }
        });
    }

    var demo3 = function() {
        var chart = AmCharts.makeChart("kt_amcharts_3", {
            "theme": "light",
            "type": "serial",
            "dataProvider": [{
                "country": "USA",
                "year2004": 3.5,
                "year2005": 4.2
            }, {
                "country": "UK",
                "year2004": 1.7,
                "year2005": 3.1
            }, {
                "country": "Canada",
                "year2004": 2.8,
                "year2005": 2.9
            }, {
                "country": "Japan",
                "year2004": 2.6,
                "year2005": 2.3
            }, {
                "country": "France",
                "year2004": 1.4,
                "year2005": 2.1
            }, {
                "country": "Brazil",
                "year2004": 2.6,
                "year2005": 4.9
            }],
            "valueAxes": [{
                "unit": "%",
                "position": "left",
                "title": "GDP growth rate",
            }],
            "startDuration": 1,
            "graphs": [{
                "balloonText": "GDP grow in [[category]] (2004): <b>[[value]]</b>",
                "fillAlphas": 0.9,
                "lineAlpha": 0.2,
                "title": "2004",
                "type": "column",
                "valueField": "year2004"
            }, {
                "balloonText": "GDP grow in [[category]] (2005): <b>[[value]]</b>",
                "fillAlphas": 0.9,
                "lineAlpha": 0.2,
                "title": "2005",
                "type": "column",
                "clustered": false,
                "columnWidth": 0.5,
                "valueField": "year2005"
            }],
            "plotAreaFillAlphas": 0.1,
            "categoryField": "country",
            "categoryAxis": {
                "gridPosition": "start"
            },
            "export": {
                "enabled": true
            }

        });
    }

    var demo4 = function() {
        var chart = AmCharts.makeChart("kt_amcharts_4", {
            "theme": "light",
            "type": "serial",
            "dataProvider": [{
                "country": "USA",
                "year2004": 3.5,
                "year2005": 4.2
            }, {
                "country": "UK",
                "year2004": 1.7,
                "year2005": 3.1
            }, {
                "country": "Canada",
                "year2004": 2.8,
                "year2005": 2.9
            }, {
                "country": "Japan",
                "year2004": 2.6,
                "year2005": 2.3
            }, {
                "country": "France",
                "year2004": 1.4,
                "year2005": 2.1
            }, {
                "country": "Brazil",
                "year2004": 2.6,
                "year2005": 4.9
            }, {
                "country": "Russia",
                "year2004": 6.4,
                "year2005": 7.2
            }, {
                "country": "India",
                "year2004": 8,
                "year2005": 7.1
            }, {
                "country": "China",
                "year2004": 9.9,
                "year2005": 10.1
            }],
            "valueAxes": [{
                "stackType": "3d",
                "unit": "%",
                "position": "left",
                "title": "GDP growth rate",
            }],
            "startDuration": 1,
            "graphs": [{
                "balloonText": "GDP grow in [[category]] (2004): <b>[[value]]</b>",
                "fillAlphas": 0.9,
                "lineAlpha": 0.2,
                "title": "2004",
                "type": "column",
                "valueField": "year2004"
            }, {
                "balloonText": "GDP grow in [[category]] (2005): <b>[[value]]</b>",
                "fillAlphas": 0.9,
                "lineAlpha": 0.2,
                "title": "2005",
                "type": "column",
                "valueField": "year2005"
            }],
            "plotAreaFillAlphas": 0.1,
            "depth3D": 60,
            "angle": 30,
            "categoryField": "country",
            "categoryAxis": {
                "gridPosition": "start"
            },
            "export": {
                "enabled": true
            }
        });
    }

     var demo6 = function() {
        var chart = AmCharts.makeChart("kt_amcharts_6", {
            "type": "serial",
            "theme": "light",
            "marginRight": 40,
            "marginLeft": 40,
            "autoMarginOffset": 20,
            "mouseWheelZoomEnabled": true,
            "dataDateFormat": "YYYY-MM-DD",
            "valueAxes": [{
                "id": "v1",
                "axisAlpha": 0,
                "position": "left",
                "ignoreAxisWidth": true
            }],
            "balloon": {
                "borderThickness": 1,
                "shadowAlpha": 0
            },
            "graphs": [{
                "id": "g1",
                "balloon": {
                    "drop": true,
                    "adjustBorderColor": false,
                    "color": "#ffffff"
                },
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "bulletSize": 5,
                "hideBulletsCount": 50,
                "lineThickness": 2,
                "title": "red line",
                "useLineColorForBulletBorder": true,
                "valueField": "value",
                "balloonText": "<span style='font-size:18px;'>[[value]]</span>"
            }],
            "chartScrollbar": {
                "graph": "g1",
                "oppositeAxis": false,
                "offset": 30,
                "scrollbarHeight": 80,
                "backgroundAlpha": 0,
                "selectedBackgroundAlpha": 0.1,
                "selectedBackgroundColor": "#888888",
                "graphFillAlpha": 0,
                "graphLineAlpha": 0.5,
                "selectedGraphFillAlpha": 0,
                "selectedGraphLineAlpha": 1,
                "autoGridCount": true,
                "color": "#AAAAAA"
            },
            "chartCursor": {
                "pan": true,
                "valueLineEnabled": true,
                "valueLineBalloonEnabled": true,
                "cursorAlpha": 1,
                "cursorColor": "#258cbb",
                "limitToGraph": "g1",
                "valueLineAlpha": 0.2,
                "valueZoomable": true
            },
            "valueScrollbar": {
                "oppositeAxis": false,
                "offset": 50,
                "scrollbarHeight": 10
            },
            "categoryField": "date",
            "categoryAxis": {
                "parseDates": true,
                "dashLength": 1,
                "minorGridEnabled": true
            },
            "export": {
                "enabled": true
            },
            "dataProvider": [{
                "date": "2012-07-27",
                "value": 13
            }, {
                "date": "2012-07-28",
                "value": 11
            }, {
                "date": "2012-07-29",
                "value": 15
            }, {
                "date": "2012-07-30",
                "value": 16
            }, {
                "date": "2012-07-31",
                "value": 18
            }, {
                "date": "2012-08-01",
                "value": 13
            }, {
                "date": "2012-08-02",
                "value": 22
            }, {
                "date": "2012-08-03",
                "value": 23
            }, {
                "date": "2012-08-04",
                "value": 20
            }, {
                "date": "2012-08-05",
                "value": 17
            }, {
                "date": "2012-08-06",
                "value": 16
            }, {
                "date": "2012-08-07",
                "value": 18
            }, {
                "date": "2012-08-08",
                "value": 21
            }, {
                "date": "2012-08-09",
                "value": 26
            }, {
                "date": "2012-08-10",
                "value": 24
            }, {
                "date": "2012-08-11",
                "value": 29
            }, {
                "date": "2012-08-12",
                "value": 32
            }, {
                "date": "2012-08-13",
                "value": 18
            }, {
                "date": "2012-08-14",
                "value": 24
            }, {
                "date": "2012-08-15",
                "value": 22
            }, {
                "date": "2012-08-16",
                "value": 18
            }, {
                "date": "2012-08-17",
                "value": 19
            }, {
                "date": "2012-08-18",
                "value": 14
            }, {
                "date": "2012-08-19",
                "value": 15
            }, {
                "date": "2012-08-20",
                "value": 12
            }, {
                "date": "2012-08-21",
                "value": 8
            }, {
                "date": "2012-08-22",
                "value": 9
            }, {
                "date": "2012-08-23",
                "value": 8
            }, {
                "date": "2012-08-24",
                "value": 7
            }, {
                "date": "2012-08-25",
                "value": 5
            }, {
                "date": "2012-08-26",
                "value": 11
            }, {
                "date": "2012-08-27",
                "value": 13
            }, {
                "date": "2012-08-28",
                "value": 18
            }, {
                "date": "2012-08-29",
                "value": 20
            }, {
                "date": "2012-08-30",
                "value": 29
            }, {
                "date": "2012-08-31",
                "value": 33
            }, {
                "date": "2012-09-01",
                "value": 42
            }, {
                "date": "2012-09-02",
                "value": 35
            }, {
                "date": "2012-09-03",
                "value": 31
            }, {
                "date": "2012-09-04",
                "value": 47
            }, {
                "date": "2012-09-05",
                "value": 52
            }, {
                "date": "2012-09-06",
                "value": 46
            }, {
                "date": "2012-09-07",
                "value": 41
            }, {
                "date": "2012-09-08",
                "value": 43
            }, {
                "date": "2012-09-09",
                "value": 40
            }, {
                "date": "2012-09-10",
                "value": 39
            }, {
                "date": "2012-09-11",
                "value": 34
            }, {
                "date": "2012-09-12",
                "value": 29
            }, {
                "date": "2012-09-13",
                "value": 34
            }, {
                "date": "2012-09-14",
                "value": 37
            }, {
                "date": "2012-09-15",
                "value": 42
            }, {
                "date": "2012-09-16",
                "value": 49
            }, {
                "date": "2012-09-17",
                "value": 46
            }, {
                "date": "2012-09-18",
                "value": 47
            }, {
                "date": "2012-09-19",
                "value": 55
            }, {
                "date": "2012-09-20",
                "value": 59
            }, {
                "date": "2012-09-21",
                "value": 58
            }, {
                "date": "2012-09-22",
                "value": 57
            }, {
                "date": "2012-09-23",
                "value": 61
            }, {
                "date": "2012-09-24",
                "value": 59
            }, {
                "date": "2012-09-25",
                "value": 67
            }, {
                "date": "2012-09-26",
                "value": 65
            }, {
                "date": "2012-09-27",
                "value": 61
            }, {
                "date": "2012-09-28",
                "value": 66
            }, {
                "date": "2012-09-29",
                "value": 69
            }, {
                "date": "2012-09-30",
                "value": 71
            }, {
                "date": "2012-10-01",
                "value": 67
            }, {
                "date": "2012-10-02",
                "value": 63
            }, {
                "date": "2012-10-03",
                "value": 46
            }, {
                "date": "2012-10-04",
                "value": 32
            }, {
                "date": "2012-10-05",
                "value": 21
            }, {
                "date": "2012-10-06",
                "value": 18
            }, {
                "date": "2012-10-07",
                "value": 21
            }, {
                "date": "2012-10-08",
                "value": 28
            }, {
                "date": "2012-10-09",
                "value": 27
            }, {
                "date": "2012-10-10",
                "value": 36
            }, {
                "date": "2012-10-11",
                "value": 33
            }, {
                "date": "2012-10-12",
                "value": 31
            }, {
                "date": "2012-10-13",
                "value": 30
            }, {
                "date": "2012-10-14",
                "value": 34
            }, {
                "date": "2012-10-15",
                "value": 38
            }, {
                "date": "2012-10-16",
                "value": 37
            }, {
                "date": "2012-10-17",
                "value": 44
            }, {
                "date": "2012-10-18",
                "value": 49
            }, {
                "date": "2012-10-19",
                "value": 53
            }, {
                "date": "2012-10-20",
                "value": 57
            }, {
                "date": "2012-10-21",
                "value": 60
            }, {
                "date": "2012-10-22",
                "value": 61
            }, {
                "date": "2012-10-23",
                "value": 69
            }, {
                "date": "2012-10-24",
                "value": 67
            }, {
                "date": "2012-10-25",
                "value": 72
            }, {
                "date": "2012-10-26",
                "value": 77
            }, {
                "date": "2012-10-27",
                "value": 75
            }, {
                "date": "2012-10-28",
                "value": 70
            }, {
                "date": "2012-10-29",
                "value": 72
            }, {
                "date": "2012-10-30",
                "value": 70
            }, {
                "date": "2012-10-31",
                "value": 72
            }, {
                "date": "2012-11-01",
                "value": 73
            }, {
                "date": "2012-11-02",
                "value": 67
            }, {
                "date": "2012-11-03",
                "value": 68
            }, {
                "date": "2012-11-04",
                "value": 65
            }, {
                "date": "2012-11-05",
                "value": 71
            }, {
                "date": "2012-11-06",
                "value": 75
            }, {
                "date": "2012-11-07",
                "value": 74
            }, {
                "date": "2012-11-08",
                "value": 71
            }, {
                "date": "2012-11-09",
                "value": 76
            }, {
                "date": "2012-11-10",
                "value": 77
            }, {
                "date": "2012-11-11",
                "value": 81
            }, {
                "date": "2012-11-12",
                "value": 83
            }, {
                "date": "2012-11-13",
                "value": 80
            }, {
                "date": "2012-11-14",
                "value": 81
            }, {
                "date": "2012-11-15",
                "value": 87
            }, {
                "date": "2012-11-16",
                "value": 82
            }, {
                "date": "2012-11-17",
                "value": 86
            }, {
                "date": "2012-11-18",
                "value": 80
            }, {
                "date": "2012-11-19",
                "value": 87
            }, {
                "date": "2012-11-20",
                "value": 83
            }, {
                "date": "2012-11-21",
                "value": 85
            }, {
                "date": "2012-11-22",
                "value": 84
            }, {
                "date": "2012-11-23",
                "value": 82
            }, {
                "date": "2012-11-24",
                "value": 73
            }, {
                "date": "2012-11-25",
                "value": 71
            }, {
                "date": "2012-11-26",
                "value": 75
            }, {
                "date": "2012-11-27",
                "value": 79
            }, {
                "date": "2012-11-28",
                "value": 70
            }, {
                "date": "2012-11-29",
                "value": 73
            }, {
                "date": "2012-11-30",
                "value": 61
            }, {
                "date": "2012-12-01",
                "value": 62
            }, {
                "date": "2012-12-02",
                "value": 66
            }, {
                "date": "2012-12-03",
                "value": 65
            }, {
                "date": "2012-12-04",
                "value": 73
            }, {
                "date": "2012-12-05",
                "value": 79
            }, {
                "date": "2012-12-06",
                "value": 78
            }, {
                "date": "2012-12-07",
                "value": 78
            }, {
                "date": "2012-12-08",
                "value": 78
            }, {
                "date": "2012-12-09",
                "value": 74
            }, {
                "date": "2012-12-10",
                "value": 73
            }, {
                "date": "2012-12-11",
                "value": 75
            }, {
                "date": "2012-12-12",
                "value": 70
            }, {
                "date": "2012-12-13",
                "value": 77
            }, {
                "date": "2012-12-14",
                "value": 67
            }, {
                "date": "2012-12-15",
                "value": 62
            }, {
                "date": "2012-12-16",
                "value": 64
            }, {
                "date": "2012-12-17",
                "value": 61
            }, {
                "date": "2012-12-18",
                "value": 59
            }, {
                "date": "2012-12-19",
                "value": 53
            }, {
                "date": "2012-12-20",
                "value": 54
            }, {
                "date": "2012-12-21",
                "value": 56
            }, {
                "date": "2012-12-22",
                "value": 59
            }, {
                "date": "2012-12-23",
                "value": 58
            }, {
                "date": "2012-12-24",
                "value": 55
            }, {
                "date": "2012-12-25",
                "value": 52
            }, {
                "date": "2012-12-26",
                "value": 54
            }, {
                "date": "2012-12-27",
                "value": 50
            }, {
                "date": "2012-12-28",
                "value": 50
            }, {
                "date": "2012-12-29",
                "value": 51
            }, {
                "date": "2012-12-30",
                "value": 52
            }, {
                "date": "2012-12-31",
                "value": 58
            }, {
                "date": "2013-01-01",
                "value": 60
            }, {
                "date": "2013-01-02",
                "value": 67
            }, {
                "date": "2013-01-03",
                "value": 64
            }, {
                "date": "2013-01-04",
                "value": 66
            }, {
                "date": "2013-01-05",
                "value": 60
            }, {
                "date": "2013-01-06",
                "value": 63
            }, {
                "date": "2013-01-07",
                "value": 61
            }, {
                "date": "2013-01-08",
                "value": 60
            }, {
                "date": "2013-01-09",
                "value": 65
            }, {
                "date": "2013-01-10",
                "value": 75
            }, {
                "date": "2013-01-11",
                "value": 77
            }, {
                "date": "2013-01-12",
                "value": 78
            }, {
                "date": "2013-01-13",
                "value": 70
            }, {
                "date": "2013-01-14",
                "value": 70
            }, {
                "date": "2013-01-15",
                "value": 73
            }, {
                "date": "2013-01-16",
                "value": 71
            }, {
                "date": "2013-01-17",
                "value": 74
            }, {
                "date": "2013-01-18",
                "value": 78
            }, {
                "date": "2013-01-19",
                "value": 85
            }, {
                "date": "2013-01-20",
                "value": 82
            }, {
                "date": "2013-01-21",
                "value": 83
            }, {
                "date": "2013-01-22",
                "value": 88
            }, {
                "date": "2013-01-23",
                "value": 85
            }, {
                "date": "2013-01-24",
                "value": 85
            }, {
                "date": "2013-01-25",
                "value": 80
            }, {
                "date": "2013-01-26",
                "value": 87
            }, {
                "date": "2013-01-27",
                "value": 84
            }, {
                "date": "2013-01-28",
                "value": 83
            }, {
                "date": "2013-01-29",
                "value": 84
            }, {
                "date": "2013-01-30",
                "value": 81
            }]
        });

        chart.addListener("rendered", zoomChart);

        zoomChart();

        function zoomChart() {
            chart.zoomToIndexes(chart.dataProvider.length - 40, chart.dataProvider.length - 1);
        }
    }
  
    return {
        // public functions
        init: function() {
            demo1();
            demo2();
            demo3();
            demo4();
            demo6();
           
        }
    };
}();

jQuery(document).ready(function() {
    KTamChartsChartsDemo.init();
});