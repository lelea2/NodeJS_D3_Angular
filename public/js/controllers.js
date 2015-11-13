'use strict';

/* Controllers */
angular.module('nreApp.controllers', []).controller('NREAppController', function NREAppController ($scope, $http) {

    var nre = window.CI_NRE, //"mre:20,cre:10,nre:50"
        nreArr = nre.split(','),
        mre = parseInt((nreArr[0].split(':'))[1], 10) || 0,
        cre = parseInt((nreArr[1].split(':'))[1], 10) || 0,
        nre = parseInt((nreArr[2].split(':'))[1], 10) || 0,
        nreData = [
            {'label': 'mre', 'value': mre},
            {'label': 'cre', 'value': cre},
            {'label': 'nre', 'value': nre},
            {'label': 'other', 'value': (100 - mre - cre - nre)}
        ],
        weeklyStats = window.CI_weeklyStats;

    $scope.perfData = window.CI_Perf || [];
    $scope.currentPartner = window.CI_currentPartner;
    $scope.nreBreakdown = window.CI_nreBreakdown;
    $scope.actuBreakdown = window.CI_actuBreakdown;
    $scope.daycount = 8;
    $scope.currentBarView = 'riqactivations';

    generatePieChart();
    generateBarChart($scope.currentBarView);

    $scope.totalActivation = weeklyStats.riqactivations.sum;
    $scope.totalRedemption = weeklyStats.riqredemptions.sum;
    $scope.totalActiveUsers = weeklyStats.activeusers.sum;

    $scope.changeGraph = function() {
        $http.get('/activationData/?p=' + $scope.currentPartner + '&daycount=' + $scope.daycount).then(function(response) {
            //console.log(response);
            var data = response.data;
            if (data) {
                $('#bar-chart').empty();
                $scope.perfData = data.perfStats;
                $scope.nreBreakdown = data.actDrilldn;
                $scope.actuBreakdown = data.actuDrilldn;
                //Changing for total tile
                $scope.totalActivation = data.weeklyStats.riqactivations.sum;
                $scope.totalRedemption = data.weeklyStats.riqredemptions.sum;
                $scope.totalActiveUsers = data.weeklyStats.activeusers.sum;
                //console.log($scope.currentBarView);
                generateBarChart($scope.currentBarView);
            }
        }, function(response) {
            console.log(response);
        });
    };

    $scope.activationClick = function($event) {
        reset();
        $('.tile.activations').addClass('active');
        generateBarChart('riqactivations');
    };

    $scope.remdemptionClick = function($event) {
        //alert('redemption click');
        reset();
        $('.tile.redemptions').addClass('active');
        generateBarChart('riqredemptions');
    };

    $scope.activeuserClick = function($event) {
        //alert('activeuserClick');
        reset();
        $('.tile.activeusers').addClass('active');
        generateBarChart('activeusers');
    };


    //Re-set barchart drawing
    function reset() {
        $('.tile').removeClass('active');
        $('#bar-chart').empty();
    }

    function generatePieChart() {
        var w = 200;
        var h = 200;
        var r = h/2;
        var color = d3.scale.category20c();
        var vis = d3.select('#pie-chart').append("svg:svg").data([nreData]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
        var pie = d3.layout.pie().value(function(d){return d.value;});

        // declare an arc generator function
        var arc = d3.svg.arc().outerRadius(r);

        // select paths, use arc generator to draw
        var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
        arcs.append("svg:path")
            .attr("fill", function(d, i){
            return color(i);
            })
            .attr("d", function (d) {;
                return arc(d);
            });

        // add the text
        arcs.append("svg:text").attr("transform", function(d) {
            d.innerRadius = 0;
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";}
        ).attr("text-anchor", "middle").text(function(d, i) {
            return nreData[i].label;
        });
    }

    function generateBarChart(type) {
        $scope.currentBarView = type;
        var dataset = [],
            results,
            chart,
            bars,
            margin = {top: 20, right: 20, bottom: 50, left: 60},
            w = 1000 - margin.left - margin.right,
            h = 500 - margin.top - margin.bottom,
            xScale, yScale, xAxis, yAxis, tip;

        //start mapping request
        results = d3.map($scope.perfData);
        results.forEach( function( key, val ) {
            var result = {};
            result.date = val['created'].substring(5, 10);
            result.value = val[type];
            result.nre = '';
            result.cre = '';
            result.mre = '';
            result.def = '';
            dataset.push(result);
        });
        if (type === 'riqactivations') {
            angular.forEach($scope.nreBreakdown, function (data, index) {
                dataset[index].nre = data.nreactivations;
                dataset[index].cre = data.creactivations;
                dataset[index].mre = data.mreactivations;
                dataset[index].def = data.defactivations;
            });
        } else if (type === 'activeusers') {
            angular.forEach($scope.actuBreakdown, function (data, index) {
                dataset[index].nre = data.nreactivators;
                dataset[index].cre = data.creactivators;
                dataset[index].mre = data.mreactivators;
                dataset[index].def = data.defactivators;
            });
        }

        chart = d3.select("#bar-chart").append("svg")
                .attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        xScale = d3.scale.ordinal()
                .rangeRoundBands([0, w], .05);

        yScale = d3.scale.linear()
                .range([h, 0]);
        xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");

        yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left");

        xScale.domain(dataset.map(function(d) { return d.date; }));
        yScale.domain([0, d3.max(dataset, function(d) {return d.value;})])
        tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return "<div><strong>Total:</strong> <span style='color:red'>" + d.value + "</span></div>"
                        +  "<div><strong>nre:</strong> <span style='color:red'>" + d.nre + "</span></div>"
                        +  "<div><strong>cre:</strong> <span style='color:red'>" + d.cre + "</span></div>"
                        +  "<div><strong>mre:</strong> <span style='color:red'>" + d.mre + "</span></div>"
                        +  "<div><strong>def:</strong> <span style='color:red'>" + d.def + "</span></div>";
                });
        chart.call(tip);
        chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-1em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-45)" );
        chart.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Total");

        //Create bars
        chart.selectAll(".bar")
                .data(dataset)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return xScale(d.date); })
                .attr("width", xScale.rangeBand())
                .attr("y", function(d) { return yScale(d.value); })
                .attr("height", function(d) { return h - yScale(d.value); })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);
    }
});
