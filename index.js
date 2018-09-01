const QUANDL_API_URL='https://www.quandl.com/api/v3/datasets/ZILLOW/';
var months = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September',
    'October', 'November', 'December'
];
function monthNumToName(monthnum) {
    return months[monthnum - 1] || '';
}
$(".submitbutton").on('click',function(e) {
    var data1set=new Array(),data2set=new Array(),datamonth=new Array(),totalcost1=0,totalcost2=0,cityname1='',cityname2='',median1=0,median2=0;
    data1set=[0];
    data2set=[0];
    const city1=$('#inputCity1').val();
    const city2=$('#inputCity2').val();
    var request = new XMLHttpRequest();
    request.open('GET', QUANDL_API_URL+'C'+city1+'_ZRISFRR?api_key=hzmgKTSmvyCcncCbDGtd', false);
    request.onload = function () {
        cityname1=jQuery.parseJSON(this.response).dataset.name.toString().split('-')[3];
        var data1 = jQuery.parseJSON(this.response).dataset.data;
        $.each(data1, function( index, value ) {
            var $date1=value.toString().split(',')[0];

            if ($date1.toString().split('-')[0]==2018){
                datamonth.push(monthNumToName($date1.toString().split('-')[1]));
                data1set.push(value.toString().split(',')[1]);
                totalcost1=totalcost1+parseInt(value.toString().split(',')[1]);
            }
        });
        median1=Math.round(totalcost1/(parseInt(data1set.length)-1));
        console.log(data1set);
    };

    request.send();
    var request = new XMLHttpRequest();
    request.open('GET', QUANDL_API_URL+'C'+city2+'_ZRISFRR?api_key=hzmgKTSmvyCcncCbDGtd', false);
    request.onload = function () {
        var data2 = jQuery.parseJSON(this.response).dataset.data;
        cityname2=jQuery.parseJSON(this.response).dataset.name.toString().split('-')[3];
        $.each(data2, function( index, value ) {
            var $date2=value.toString().split(',')[0];
            if ($date2.toString().split('-')[0]==2018){
                data2set.push(value.toString().split(',')[1]);
                totalcost2=totalcost2+parseInt(value.toString().split(',')[1]);
            }
        });
        median2=Math.round(totalcost2/(parseInt(data2set.length)-1));
        console.log(totalcost2);
    };
    request.send();
    console.log(cityname1,cityname2,median1,median2);
    var barChartData = {
        labels: datamonth.reverse(),
        datasets: [{
            label: cityname1,
            backgroundColor: 'rgba(0, 99, 132, 0.6)',
            yAxisID: 'y-axis-1',
            data: data1set.reverse()
        }, {
            label: cityname2,
            backgroundColor: 'rgba(100, 99, 132, 0.6)',
            yAxisID: 'y-axis-2',
            data: data2set.reverse()
        }]
    };

    var ctx = document.getElementById('chart').getContext('2d');
    var myBar = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
            responsive: true,
            title: {
                display: true,
                text: cityname1+' VS '+cityname2
            },
            tooltips: {
                mode: 'index',
                intersect: true
            },
            scales: {
                yAxes: [{
                    type: 'linear',
                    display: true,
                    position: 'left',
                    id: 'y-axis-1',
                }, {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    id: 'y-axis-2',
                    gridLines: {
                        drawOnChartArea: false
                    }
                }],
            }
        }
    });
    $('#homeprice').html(cityname1+':'+' $'+median1+'<br>'+cityname2+':'+' $'+median2);
    myBar.update();
    e.preventDefault();

    return false;
});
