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
                axios.get(`/regions/${districtID}/results`).then(function(response){
                    let district = self.districts
                    self.results = response.data;
                    self.results.forEach(function(r) {
                        r.partyName = self.partyNames[r.party_id];
                        r.erststimmenRelative = r.erststimmen / self.currentDistrict.voters;
                        r.zweitstimmenRelative = r.zweitstimmen / self.currentDistrict.voters;
                    })
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