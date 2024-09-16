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
        fill: am5.color(0xffffff),
        text: "0"  // Initial text
    }));

    axisDataItem.set("value", 0);  // Initial value

    var colorSet = am5.ColorSet.new(root, {});

    // Create existing ranges
    var axisRanges = [
        { start: 0, end: 18.5, color: colorSet.getIndex(0) },
        { start: 18.5, end: 24.9, color: colorSet.getIndex(1) },
        { start: 24.9, end: 29.9, color: colorSet.getIndex(2) },
        { start: 29.9, end: 40, color: colorSet.getIndex(3) }
    ];

    axisRanges.forEach(range => {
        var axisRange = xAxis.createAxisRange(xAxis.makeDataItem({
            above: true,
            value: range.start,
            endValue: range.end
        }));

        axisRange.get("axisFill").setAll({
            visible: true,
            fill: range.color
        });

        axisRange.get("label").setAll({
            forceHidden: true
        });
    });

    // Neon green overlay range
    var neonGreenRange = xAxis.createAxisRange(xAxis.makeDataItem({
        above: true,
        value: 0,
        endValue: 0
    }));

    neonGreenRange.get("axisFill").setAll({
        visible: true,
        fill: am5.color(0x39FF14)  // Neon green color
    });

    neonGreenRange.get("label").setAll({
        forceHidden: true
    });

    chart.appear(1000, 100);

    // Function to update gauge value
    window.updateGauge = function(bmi) {
        if (bmi >= 0 && bmi <= 40) {
            // Add popOut class to trigger the animation
            var chartDiv = document.getElementById("chartdiv");
            chartDiv.classList.add("popOut");

            // Reset gauge and clear inputs after 5 seconds
            setTimeout(function() {
                // Reset gauge value and Neon Green Range
                resetGauge();
                clearInputs();
            }, 5000);  // 5 seconds delay

            // Animate gauge
            animateGauge(bmi);
        }
    };

    // Function to animate gauge
    function animateGauge(bmi) {
        axisDataItem.set("value", bmi);

        // Animate Needle Movement
        var angle = (bmi / 40) * 180;  // Convert BMI to gauge angle
        bullet.get("sprite").animate({
            key: "rotation",
            to: angle - 180,  // Adjust rotation based on gauge start angle
            duration: 1000,  // Duration of the animation
            easing: am5.ease.out(am5.ease.cubic)
        });

        // Update and Animate Neon Green Range
        neonGreenRange.set("endValue", bmi);  // Update endValue

        // Animate Neon Green Fill
        neonGreenRange.get("axisFill").set("fill", am5.color('#6fffe9'));

        // Animate Text
        label.animate({
            key: "text",
            to: Math.round(bmi).toString(),
            duration: 1000,
            easing: am5.ease.out(am5.ease.cubic)
        });
    }

    // Function to reset gauge
    function resetGauge() {
        axisDataItem.set("value", 0);
        neonGreenRange.set("endValue", 0);

        bullet.get("sprite").animate({
            key: "rotation",
            to: -180,  // Reset rotation to initial position
            duration: 1000,
            easing: am5.ease.out(am5.ease.cubic)
        });

        label.animate({
            key: "text",
            to: "0",
            duration: 1000,
            easing: am5.ease.out(am5.ease.cubic)
        });

        var chartDiv = document.getElementById("chartdiv");
        chartDiv.classList.remove("popOut");
    }

    // Function to clear input fields
    function clearInputs() {
        document.querySelectorAll('input').forEach(input => input.value = '');
    }
});
