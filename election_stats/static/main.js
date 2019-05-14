"use strict";

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
                var erststimmenChart = [];
                var zweitstimmenChart = [];
                var erstzweitstimmenChart = [];
                console.log(`Fetch results for ${districtID}...`)
                let self = this;
                axios.get(`/regions/${districtID}/results`).then(function(response){
                    let district = self.districts
                    self.results = response.data;
                    self.results.forEach(function(r) {
                        r.partyName = self.partyNames[r.party_id];
                        r.erststimmenRelative = r.erststimmen / self.currentDistrict.voters;
                        r.zweitstimmenRelative = r.zweitstimmen / self.currentDistrict.voters;
                       
                        if (r.party_id == 1){
                            erststimmenChart[0] = r.erststimmen;
                            zweitstimmenChart[0] = r.zweitstimmen;
                            erstzweitstimmenChart[0] = r.erststimmen;
                            erstzweitstimmenChart[1] = r.zweitstimmen;

                        }
                        if (r.party_id == 2){
                            erststimmenChart[1] = r.erststimmen;
                            zweitstimmenChart[1] = r.zweitstimmen;
                            erstzweitstimmenChart[2] = r.erststimmen;
                            erstzweitstimmenChart[3] = r.zweitstimmen;
                        }
                        if (r.party_id == 0){
                            erststimmenChart[2] = r.erststimmen;
                            zweitstimmenChart[2] = r.zweitstimmen;
                            erstzweitstimmenChart[4] = r.erststimmen;
                            erstzweitstimmenChart[5] = r.zweitstimmen;
                        }
                        if (r.party_id == 3){
                            erststimmenChart[3] = r.erststimmen;
                            zweitstimmenChart[3] = r.zweitstimmen;
                            erstzweitstimmenChart[6] = r.erststimmen;
                            erstzweitstimmenChart[7] = r.zweitstimmen;
                        }
                        if (r.party_id == 6){
                            erststimmenChart[4] = r.erststimmen;
                            zweitstimmenChart[4] = r.zweitstimmen;
                            erstzweitstimmenChart[8] = r.erststimmen;
                            erstzweitstimmenChart[9] = r.zweitstimmen;
                        }
                        if (r.party_id == 5){
                            erststimmenChart[5] = r.erststimmen;
                            zweitstimmenChart[5] = r.zweitstimmen;
                            erstzweitstimmenChart[10] = r.erststimmen;
                            erstzweitstimmenChart[11] = r.zweitstimmen;
                        }
                        if (r.party_id >= 7 || r.party_id == 4) {
                            erststimmenChart[6] = (erststimmenChart[6] || 0) + Number(r.erststimmen);
                            zweitstimmenChart[6] = (zweitstimmenChart[6] || 0) + Number(r.zweitstimmen);
                            erstzweitstimmenChart[12] = (erstzweitstimmenChart[12] || 0) + Number(r.erststimmen);
                            erstzweitstimmenChart[13] = (erstzweitstimmenChart[13] || 0) + Number(r.zweitstimmen);
                        }

                        
                    })

                    console.dir("Erstzweitstimmen: "+erstzweitstimmenChart.toString());
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
                                data: erstzweitstimmenChart
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
                                data: erststimmenChart
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
                                data: zweitstimmenChart
                            }]
                        },
                
                        // Configuration options go here
                        options: {}
                    });
    
                    document.getElementById("pie-chart").style.display = "block";
                    document.getElementById("bar-chart").style.display = "block";


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