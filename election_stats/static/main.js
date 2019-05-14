"use strict";

var chart1, chart2, chart3;

window.onload = function() {
    var app = new Vue({
        delimiters:['${', '}'],
        el: '#app',
        data: {
            partyNames: {},
            states: [],
            currentState: null,
            districts: [],
            currentDistrict: null,
            results: [],
        },
        mounted () {
            let self = this;
            let pStates = axios.get('/regions/1099/subregions');
            let pParties = axios.get('/parties');
            Promise.all([pStates, pParties]).then(function(response) {
                self.states = response[0].data;
                let parties = response[1].data;
                // Populate a map of party names by party id
                self.partyNames = {};
                parties.forEach(function(p) {
                    self.partyNames[p.id] = p.name;
                });
            }, function(response) {
                console.log("Could not fetch states and/or parties");
            });
        },
        methods: {
            getDistricts (stateID) {
                document.getElementById("pie-chart").style.display = "none";
                document.getElementById("bar-chart").style.display = "none";
                this.currentState = this.states.find((state) => (state.id == stateID));

                console.log(`Fetch districts for ${stateID}...`)
                let self = this;
                self.results = [];
                axios.get(`/regions/${stateID}/subregions`).then(function(response) {
                    self.districts = response.data;
                }, function() {
                    console.log("Could not fetch districts");
                });
            },
            getResults (districtID) {
                this.currentDistrict = this.districts.find((district) => (district.id == districtID));
                console.log(`Fetch results for ${districtID}...`)
                let self = this;

                // console.dir("Erstzweitstimmen: "+chart1.data.datasets[0].data.toString());
                var ctx1 = document.getElementById('bar').getContext('2d');
                if(chart1) chart1.destroy();
                chart1 = new Chart(ctx1, {
                    // The type of chart we want to create
                    type: 'bar',
            
                    // The data for our dataset
                    data: {
                        labels: ['SDP Erststimme','SDP Zweitstimme', 'LINKE Erststimme','LINKE Zweitstimme', 'CDU Erststimme', 'CDU Zweitstimme', 'Grüne Erststimme', 'Grüne Zweitstimme', 'AfD Erststimme', 'AfD Zweitstimme', 'FDP Erststimme', 'FDP Zweitstimme', 'Andere Zweitstimme', 'Andere Zweitstimme'],
                        datasets: [{
                            label: 'Erst- und Zweitstimmenverteilung',
                            backgroundColor:['red','red','purple','purple','black','black','green','green', 'blue', 'blue','yellow','yellow','grey','grey'],
                            borderColor: 'rgb(255, 99, 132)',
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        }]
                    },
            
                    // Configuration options go here
                    options: {}
                });

                var ctx2 = document.getElementById('pie1').getContext('2d');
                if(chart2) chart2.destroy();
                chart2 = new Chart(ctx2, {
                    // The type of chart we want to create
                    type: 'pie',
            
                    // The data for our dataset
                    data: {
                        labels: ['SDP', 'LINKE', 'CDU', 'Grüne', 'AfD', 'FDP', 'Andere'],
                        datasets: [{
                            label: 'Erststimmenverteilung',
                            backgroundColor:['red','purple','black','green', 'blue','yellow','grey'],
                            borderColor: 'rgb(255, 99, 132)',
                            data: [0, 0, 0, 0, 0, 0, 0]
                        }]
                    },
            
                    // Configuration options go here
                    options: {}
                });

                var ctx3 = document.getElementById('pie2').getContext('2d');
                if(chart3) chart3.destroy();
                chart3 = new Chart(ctx3, {
                    // The type of chart we want to create
                    type: 'pie',
            
                    // The data for our dataset
                    data: {
                        labels: ['SDP', 'LINKE', 'CDU', 'Grüne', 'AfD', 'FDP', 'Andere'],
                        datasets: [{
                            label: 'Zweitstimmenverteilung',
                            backgroundColor:['red','purple','black','green', 'blue','yellow','grey'],
                            borderColor: 'rgb(255, 99, 132)',
                            data: [0, 0, 0, 0, 0, 0, 0]
                        }]
                    },
            
                    // Configuration options go here
                    options: {}
                });

                axios.get(`/regions/${districtID}/results`).then(function(response){
                    let district = self.districts
                    self.results = response.data;
                    self.results.forEach(function(r) {
                        r.partyName = self.partyNames[r.party_id];
                        r.erststimmenRelative = r.erststimmen / self.currentDistrict.voters;
                        r.zweitstimmenRelative = r.zweitstimmen / self.currentDistrict.voters;
                       
                        if (r.party_id == 1){
                            chart2.data.datasets[0].data[0] = r.erststimmen;
                            chart3.data.datasets[0].data[0] = r.zweitstimmen;
                            chart1.data.datasets[0].data[0] = r.erststimmen;
                            chart1.data.datasets[0].data[1] = r.zweitstimmen;

                        }
                        if (r.party_id == 2){
                            chart2.data.datasets[0].data[1] = r.erststimmen;
                            chart3.data.datasets[0].data[1] = r.zweitstimmen;
                            chart1.data.datasets[0].data[2] = r.erststimmen;
                            chart1.data.datasets[0].data[3] = r.zweitstimmen;
                        }
                        if (r.party_id == 0){
                            chart2.data.datasets[0].data[2] = r.erststimmen;
                            chart3.data.datasets[0].data[2] = r.zweitstimmen;
                            chart1.data.datasets[0].data[4] = r.erststimmen;
                            chart1.data.datasets[0].data[5] = r.zweitstimmen;
                        }
                        if (r.party_id == 3){
                            chart2.data.datasets[0].data[3] = r.erststimmen;
                            chart3.data.datasets[0].data[3] = r.zweitstimmen;
                            chart1.data.datasets[0].data[6] = r.erststimmen;
                            chart1.data.datasets[0].data[7] = r.zweitstimmen;
                        }
                        if (r.party_id == 6){
                            chart2.data.datasets[0].data[4] = r.erststimmen;
                            chart3.data.datasets[0].data[4] = r.zweitstimmen;
                            chart1.data.datasets[0].data[8] = r.erststimmen;
                            chart1.data.datasets[0].data[9] = r.zweitstimmen;
                        }
                        if (r.party_id == 5){
                            chart2.data.datasets[0].data[5] = r.erststimmen;
                            chart3.data.datasets[0].data[5] = r.zweitstimmen;
                            chart1.data.datasets[0].data[10] = r.erststimmen;
                            chart1.data.datasets[0].data[11] = r.zweitstimmen;
                        }
                        if (r.party_id >= 7 || r.party_id == 4) {
                            chart2.data.datasets[0].data[6] = (chart2.data.datasets[0].data[6] || 0) + Number(r.erststimmen);
                            chart3.data.datasets[0].data[6] = (chart3.data.datasets[0].data[6] || 0) + Number(r.zweitstimmen);
                            chart1.data.datasets[0].data[12] = (chart1.data.datasets[0].data[12] || 0) + Number(r.erststimmen);
                            chart1.data.datasets[0].data[13] = (chart1.data.datasets[0].data[13] || 0) + Number(r.zweitstimmen);
                        }

                        
                    })

    
                    document.getElementById("pie-chart").style.display = "block";
                    document.getElementById("bar-chart").style.display = "block";

                    chart1.update();
                    chart2.update();
                    chart3.update();

                }, function() {
                    console.log("Could not fetch results");
                });
            },
        }
    })

    Vue.filter('toPercentage', function (value) {
        if (typeof value !== "number") {
            return value;
        }
        var formatter = new Intl.NumberFormat('de-DE', {
            style: 'decimal',
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        });
        return `${formatter.format(value*100)} %`;
    });

    window.myapp = app; // for debug 
    
}

function search(value, id) {
    var searchBar = document.getElementById(id).value.toUpperCase();
    var listitems = document.getElementById(value).getElementsByTagName("li");
    for (var i in listitems) {
        if(!isNaN(i)){
            var link = listitems[i].getElementsByTagName("a")[0];
            var query = link.textContent || link.innerText;
            if (query.toUpperCase().indexOf(searchBar) > -1) {
                listitems[i].style.display = "";
            } else listitems[i].style.display = "none";
        }
    }
}