var chartRevenue = charts.gauge({
        container: "#chartRevenue",
        value: 0,
        size: 250,
        label: "Fuel",
        minorTicks: 5,
        majorTicks: 5,
        zones: {
            red: {
                from: 80,
                to: 100
            },
            yellow: {
                from: 60,
                to: 90
            },
            green: {
                from: 0,
                to: 20
            }
        }
    }),
    val = 0;
window.setInterval(function() {
    chartRevenue.redraw(Math.floor(10 * Math.random()) + 25)
}, 100);
var chartExpenses = charts.gauge({
        container: "#chartExpenses",
        value: 0,
        size: 150,
        label: "Mileage",
        minorTicks: 5,
        majorTicks: 5,
        zones: {
            red: {
                from: 60,
                to: 100
            },
            yellow: {
                from: 75,
                to: 90
            },
            green: {
                from: 0,
                to: 50
            }
        }
    }),
    val = 0;
window.setInterval(function() {
    chartExpenses.redraw(Math.floor(10 * Math.random()) + 55)
}, 100);
var chartProfit = charts.gauge({
        container: "#chartProfit",
        value: 0,
        size: 150,
        label: "Speed",
        minorTicks: 5,
        majorTicks: 5,
        zones: {
            red: {
                from: 40,
                to: 60
            },
            yellow: {
                from: 75,
                to: 100
            },
            green: {
                from: 0,
                to: 20
            }
        }
    }),
    val = 0;
window.setInterval(function() {
    chartProfit.redraw(Math.floor(10 * Math.random()) + 55)
}, 100);