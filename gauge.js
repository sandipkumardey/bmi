am5.ready(function() {
    var root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Animated.new(root)]);

    var chart = root.container.children.push(am5radar.RadarChart.new(root, {
        panX: false,
        panY: false,
        startAngle: 180,
        endAngle: 360
    }));

    var axisRenderer = am5radar.AxisRendererCircular.new(root, { innerRadius: -40 });
    axisRenderer.grid.template.setAll({
        stroke: root.interfaceColors.get("background"),
        visible: true,
        strokeOpacity: 0.8
    });

    var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
        min: 0,
        max: 40,  // Set max value to 40 for BMI
        strictMinMax: true,
        renderer: axisRenderer
    }));

    xAxis.get("renderer").labels.template.setAll({
        fill: am5.color(0xffffff),  // Set label color to white
        fontSize: "1.1em"           // Adjust label font size (optional)
    });

    var axisDataItem = xAxis.makeDataItem({});

    var clockHand = am5radar.ClockHand.new(root, {
        pinRadius: 50,
        radius: am5.percent(100),
        innerRadius: 50,
        bottomWidth: 0,
        topWidth: 0
    });

    clockHand.pin.setAll({
        fillOpacity: 0,
        strokeOpacity: 0.5,
        stroke: am5.color(0xffffff),
        strokeWidth: 1,
        strokeDasharray: [2, 2]
    });

    clockHand.hand.setAll({
        fillOpacity: 0,
        strokeOpacity: 0.5,
        stroke: am5.color(0xffffff),
        strokeWidth: 0.5
    });

    var bullet = axisDataItem.set("bullet", am5xy.AxisBullet.new(root, {
        sprite: clockHand
    }));

    xAxis.createAxisRange(axisDataItem);

    var label = chart.radarContainer.children.push(am5.Label.new(root, {
        centerX: am5.percent(50),
        textAlign: "center",
        centerY: am5.percent(50),
        fontSize: "1.5em",
        fill: am5.color(0xffffff)
    }));

    axisDataItem.set("value", 20);  // Initial value

    bullet.get("sprite").on("rotation", function() {
        var value = axisDataItem.get("value");
        label.set("text", Math.round(value).toString());
    });

    var colorSet = am5.ColorSet.new(root, {});

    var axisRange0 = xAxis.createAxisRange(xAxis.makeDataItem({
        above: true,
        value: 0,
        endValue: 18.5
    }));
    
    axisRange0.get("axisFill").setAll({
        visible: true,
        fill: colorSet.getIndex(0)  // Underweight color
    });

    axisRange0.get("label").setAll({
        forceHidden: true
    });

    var axisRange1 = xAxis.createAxisRange(xAxis.makeDataItem({
        above: true,
        value: 18.5,
        endValue: 24.9
    }));

    axisRange1.get("axisFill").setAll({
        visible: true,
        fill: colorSet.getIndex(1)  // Normal weight color
    });

    axisRange1.get("label").setAll({
        forceHidden: true
    });

    var axisRange2 = xAxis.createAxisRange(xAxis.makeDataItem({
        above: true,
        value: 24.9,
        endValue: 29.9
    }));

    axisRange2.get("axisFill").setAll({
        visible: true,
        fill: colorSet.getIndex(2)  // Overweight color
    });

    axisRange2.get("label").setAll({
        forceHidden: true
    });

    var axisRange3 = xAxis.createAxisRange(xAxis.makeDataItem({
        above: true,
        value: 29.9,
        endValue: 40
    }));

    axisRange3.get("axisFill").setAll({
        visible: true,
        fill: colorSet.getIndex(3)  // Obesity color
    });

    axisRange3.get("label").setAll({
        forceHidden: true
    });

    chart.appear(1000, 100);

    // Function to update gauge value
    window.updateGauge = function(bmi) {
        if (bmi >= 0 && bmi <= 40) {
            axisDataItem.set("value", bmi);
        }
    };
});
