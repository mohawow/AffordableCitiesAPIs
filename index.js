$(document).ready(function () {
    $.ajaxSetup({
        async: false
    });
    $.getJSON( 'https://raw.githubusercontent.com/mohawow/AffordableCitiesAPIs/master/convertcsv.json', {
        tagmode: "any",
        format: "json"
    }).done(function( result ) {
        $.each(result, function( index, value ) {
            $('#inputCity1').append('<option value="'+value.City+'">'+value.City+'</option>');
            $('#inputCity2').append('<option value="'+value.City+'">'+value.City+'</option>');
        });

    });
    $(".cselect").chosen({no_results_text: "Oops, nothing found!"});
});
const QUANDL_API_URL='https://www.quandl.com/api/v3/datasets/ZILLOW/';
var data1set=[],data2set=[],datamonth=[],totalcost1=0,totalcost2=0,cityname1='',cityname2='',median1=0,median2=0;
var months = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September',
    'October', 'November', 'December'
];
function monthNumToName(monthnum) {
    return months[monthnum - 1] || '';
}
function getcity1data(){
    $.getJSON( QUANDL_API_URL+'C'+$city1+'_ZRISFRR?api_key=hzmgKTSmvyCcncCbDGtd', {
        tags: "",
        tagmode: "any",
        format: "json"
    }).done(function( result ) {
        cityname1=result.dataset.name.toString().split('-')[3];
        var data1 = result.dataset.data;
        $.each(data1, function( index, value ) {
            var $date1=value.toString().split(',')[0];

            if ($date1.toString().split('-')[0]==2018){
                datamonth.push(monthNumToName($date1.toString().split('-')[1]));
                data1set.push(value.toString().split(',')[1]);
                totalcost1=totalcost1+parseInt(value.toString().split(',')[1]);
            }
        });
        median1=Math.round(totalcost1/(parseInt(data1set.length)-1));
    }).fail(function() { swal('Sorry!',' Data For '+city1+' Not Found! Please Choose Another City','warning'); });
};
function getcity2data(){
    $.getJSON( QUANDL_API_URL+'C'+$city2+'_ZRISFRR?api_key=hzmgKTSmvyCcncCbDGtd', {
        tags: "",
        tagmode: "any",
        format: "json"
    }).done(function( result ) {
        console.log(result);
        var data2 = result.dataset.data;
        console.log(result.dataset.data);
        cityname2=result.dataset.name.toString().split('-')[3];
        $.each(data2, function( index, value ) {
            var $date2=value.toString().split(',')[0];
            if ($date2.toString().split('-')[0]==2018){
                data2set.push(value.toString().split(',')[1]);
                totalcost2=totalcost2+parseInt(value.toString().split(',')[1]);
            }
        });
        median2=Math.round(totalcost2/(parseInt(data2set.length)-1));
        console.log(totalcost2);
    }).fail(function() { swal('Sorry!',' Data For '+city2+' Not Found! Please Choose Another City','warning'); });
};
function getCityNameCodes(c1,c2){
    $.getJSON( 'https://raw.githubusercontent.com/mohawow/AffordableCitiesAPIs/master/convertcsv.json', {
        tagmode: "any",
        format: "json"
    }).done(function( result ) {
        $.each(result, function( index, value ) {
            if (value.City==c1){
                $city1=value.Code;
            }
            if (value.City==c2){
                $city2=value.Code;
            }
        });

    });
    return [$city1,$city2];
};
$(".submitbutton").on('click',function(e) {
    data1set=null;
    data2set=null;
    datamonth=[];
    data1set=[0];
    data2set=[0];
    city1=$('#inputCity1').val();
    city2=$('#inputCity2').val();
    $cnames=getCityNameCodes(city1,city2);
    $city1=$cnames[0];
    $city2=$cnames[1];
    $.ajaxSetup({
        async: false
    });
    getcity1data();
    getcity2data();
    var barChartData = {
        labels: datamonth.reverse(),
        datasets: [{
            label: cityname1,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            data: data1set.reverse()
        }, {
            label: cityname2,
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
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
            }
        }
    });
    $('#homeprice').html(cityname1+':'+' $'+median1+'<br>'+cityname2+':'+' $'+median2);
    myBar.update();
    e.preventDefault();

    return false;
});
