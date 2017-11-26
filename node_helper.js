var NodeHelper = require('node_helper');
var request = require('request');
var parseString = require('xml2js').parseString;
const Mta = require('mta-gtfs');
const mta = new Mta({
  key: '2dd40d377edde733d34cab03c597a670', // only needed for mta.schedule() method  
});

var reloadTimer = null;

module.exports = NodeHelper.create({
    defaults: {
        fetchInterval: 5 * 60 * 1000
    },

    start: function() {
        console.log('MTA helper started...')
    },

    getMTAData: function(self, config) {
        if (!config.fetchInterval) {
            config.fetchInterval = this.defaults.fetchInterval;            
        }

        var timestamp = Date.now().toString();
        var url = "http://web.mta.info/status/serviceStatus.txt";
        request({
            url: url,
            method: 'GET'
        }, function(error, response, body) {
            parseString(body, function(err, result) {
                var lines = result.service.subway[0].line.filter(line => {
                    if (line.name[0] === "SIR") {
                        return false;
                    }
                    // Return specific lines are all if none are set.
                    return config.lines ? config.lines.indexOf(line.name[0]) > -1 : true;
                });
                self.sendSocketNotification('LINE_DATA', {
                    data: lines,
                    updated: result.service.timestamp
                });
            });
        });


        this.scheduleTimer(self, config);
    },

    getNextTrain: function() {
        mta.schedule("F14", 21).then(function (result) {
            self.sendSocketNotification('NEXT_TRAIN_DATA',result.schedule["F14"].N);
        }); 
    },
    scheduleTimer: function(self, config) {
        clearTimeout(reloadTimer);
        reloadTimer = setTimeout(() => {
            this.getMTAData(self, config);
        }, config.fetchInterval);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_MTA_STATUS") {
            this.getMTAData(this, payload);
        }
    }
});