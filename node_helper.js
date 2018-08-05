var NodeHelper = require('node_helper');
const Mta = require('mta-gtfs');

var reloadTimer = null;

module.exports = NodeHelper.create({
  defaults: {
    fetchInterval: 15 * 60 * 1000,
  },

  start: function() {
    console.log('MTA helper started...');
    this.mta = false;
  },

  getMTAData: function(self, config) {
    if (!this.mta) {
        console.log(config);
      this.mta = new Mta({
        key: console.api_key
      });
    }

    if (!config.fetchInterval) {
      config.fetchInterval = this.defaults.fetchInterval;
    }

    var timestamp = Date.now().toString();
    this.mta.status()
      .then(data => {
        let lines = data.subway;

        if (config.lines) {
          lines = data.subway.filter(line => {
            return config.lines.includes(line.name);
          });
        }
        this.sendSocketNotification('LINE_DATA', {
          data: lines,
        });
      })
      .catch(err => {
        console.log(err);
      });

    this.scheduleTimer(self, config);
  },

  startClock: function(nextTrainTimes) {
    var currentTime = new Date().getTime();
    var nextDepartTime = 0;
    for (var i = 0; i < nextTrainTimes.length; i++) {
      var nextTrain = nextTrainTimes[i];
      if (nextTrain.departureTime * 1000 > currentTime) {
        nextDepartTime = new Date(nextTrain.departureTime * 1000);
        break;
      }
    }
  },

  scheduleTimer: function(self, config) {
    clearTimeout(reloadTimer);
    reloadTimer = setTimeout(() => {
      this.getMTAData(self, config);
    }, config.fetchInterval);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === 'GET_MTA_STATUS') {
      this.getMTAData(this, payload);
    }
  },
});
