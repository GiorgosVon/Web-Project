var ctx = document.getElementById('myChart2').getContext('2d');
var myChart2 = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",
            "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"],
        datasets: [{
            label: '',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }]
        }


    }
});

var contentTypeData = JSON.parse(document.getElementById("contentTypeData").value);

$('#typeSelector').on('change', function () {
    myChart2.data.datasets[0].label = "Content Type"
    myChart2.data.datasets[0].data = [];
    myChart2.data.datasets[0].backgroundColor = [];
    myChart2.data.datasets[0].borderColor = [];
    var values = $(this).val();

    // if user selected 1 choice
    if (values.length === 1) {
        for (content of contentTypeData) {
            if (content.type == values[0]) {
                for (let i = 1; i <= 24; i++) {
                    if (content.avg.hasOwnProperty(i)) {
                        myChart2.data.datasets[0].data.push(content.avg[`${i}`].average);
                    } else {
                        myChart2.data.datasets[0].data.push(0);
                    }
                    var color = "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ",";
                    myChart2.data.datasets[0].backgroundColor.push(color + "0.3)");
                    myChart2.data.datasets[0].borderColor.push(color + "1)");
                }
            }
        }
        myChart2.update();

    } else if (values.length > 1) {
        let obj = {};
        // create temp obj
        // for each user input iterate over objects
        // do weighted average calculation
        for (value of values) {
            for (content of contentTypeData) {
                if (content.type === value) {
                    let avgObj = content.avg;
                    for (key in avgObj) {
                        if (!(key in obj)) {
                            obj[`${key}`] = avgObj[key]
                        } else if (key in obj) {
                            let tempAvg = ((obj[key].average * obj[key].count) + (avgObj[key].average * avgObj[key].count)) / (obj[key].count + avgObj[key].count);
                            let tempCount = obj[key].count + avgObj[key].count

                            obj[key].average = tempAvg;
                            obj[key].count = tempCount;
                        }
                    }
                }
            }
        }

        // use temp object to create graph
        for (let i = 1; i <= 24; i++) {
            if (obj.hasOwnProperty(i)) {
                myChart2.data.datasets[0].data.push(obj[`${i}`].average);
            } else {
                myChart2.data.datasets[0].data.push(0);
            }
            var color = "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ",";
            myChart2.data.datasets[0].backgroundColor.push(color + "0.3)");
            myChart2.data.datasets[0].borderColor.push(color + "1)");
        }
        myChart2.update();
    }
});
