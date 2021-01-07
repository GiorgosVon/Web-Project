var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Quantity',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
        }]
    },
    options: {
        responsive:true,
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom:0
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    stepSize:250
                }
            }]
        }
        
        
    }
});

$(document).ready(function() {
  
    $(".collapse").on('shown.bs.collapse',()=>{
        // get div that is being showed
        var tbody = $(".groupOfTables").find(".show").find("table").find('tbody')
        var rows = $(tbody).find('tr')
        myChart.data.labels = [];
        myChart.data.datasets[0].data = [];
        myChart.data.datasets[0].backgroundColor = [];
        myChart.data.datasets[0].borderColor = [];
        for (var i=0; i<$(rows).length; i++){
            myChart.data.labels.push($(rows[i]).find('td')[0].innerHTML);
            myChart.data.datasets[0].data.push(parseInt($(rows[i]).find('td')[1].innerHTML))
            // We generate a random color
            var color = "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ",";
            // We push this new color to both background and border color arrays
            // .. a lighter color is used for the background            
            myChart.data.datasets[0].backgroundColor.push(color + "0.3)");
            myChart.data.datasets[0].borderColor.push(color + "1)");
        }
        myChart.update();
    })
})