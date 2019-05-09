"use strict";
window.onload = function() {
    var app = new Vue({
        delimiters:['${', '}'],
        el: '#app',
        data: {
            message: 'Hello Vue!',
            states: [],
            districts: [],
        },
        mounted () {
            let self = this;
            axios.get('/regions/1099/subregions').then(function(response) {
                self.states = response.data;
            }, function() {
                console.log("Could not fetch states");
            });
        },
        methods: {
            getDistricts (stateID) {
                console.log(`Fetch districts for ${stateID}...`)
                let self = this;
                axios.get(`/regions/${stateID}/subregions`).then(function(response) {
                    self.districts = response.data;
                }, function() {
                    console.log("Could not fetch districts");
                });
            },
        }
    })

    window.myapp = app; // for debug 
}