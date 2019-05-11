var ctx1 = document.getElementById('bar').getContext('2d');
var chart1 = new Chart(ctx1, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: ['SDP Erststimme','SDP Zweitstimme', 'LINKE Erststimme','LINKE Zweitstimme', 'CDU Erststimme', 'CDU Zweitstimme', 'Grüne Erststimme', 'Grüne Zweitstimme', 'AfD Erststimme', 'AfD Zweitstimme', 'FDP Erststimme', 'FDP Zweitstimme', 'Andere Zweitstimme', 'Andere Zweitstimme'],
        datasets: [{
            label: 'Erst- und Zweitstimmenverteilung',
            backgroundColor:['red','red','purple','purple','black','black','green','green', 'blue', 'blue','yellow','yellow','grey','grey'],
            borderColor: 'rgb(255, 99, 132)',
            data: [20, 20, 15, 15, 30, 30, 10, 10, 4, 4, 10, 10, 11, 11]
        }]
    },

    // Configuration options go here
    options: {}
});

var ctx2 = document.getElementById('pie1').getContext('2d');
var chart2 = new Chart(ctx2, {
    // The type of chart we want to create
    type: 'pie',

    // The data for our dataset
    data: {
        labels: ['SDP', 'LINKE', 'CDU', 'Grüne', 'AfD', 'FDP', 'Andere'],
        datasets: [{
            label: 'Erststimmenverteilung',
            backgroundColor:['red','purple','black','green', 'blue','yellow','grey'],
            borderColor: 'rgb(255, 99, 132)',
            data: [20, 15, 30, 10, 4, 10, 11]
        }]
    },

    // Configuration options go here
    options: {}
});

var ctx3 = document.getElementById('pie2').getContext('2d');
var chart3 = new Chart(ctx3, {
    // The type of chart we want to create
    type: 'pie',

    // The data for our dataset
    data: {
        labels: ['SDP', 'LINKE', 'CDU', 'Grüne', 'AfD', 'FDP', 'Andere'],
        datasets: [{
            label: 'Zweitstimmenverteilung',
            backgroundColor:['red','purple','black','green', 'blue','yellow','grey'],
            borderColor: 'rgb(255, 99, 132)',
            data: [20, 15, 30, 10, 4, 10, 11]
        }]
    },

    // Configuration options go here
    options: {}
});