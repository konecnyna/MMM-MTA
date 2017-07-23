
var NodeHelper = require('node_helper');
var request = require('request');
var parseString = require('xml2js').parseString;
var reloadTimer = null;

module.exports = NodeHelper.create({
	defaults: {
		fetchInterval: 5 * 60 * 1000
	},

	start: function () {
		console.log('MTA helper started...')
	},

	getMTAData: function (self, config) {
		if (!config.fetchInterval) {
			config.fetchInterval = this.defaults.fetchInterval;
		}

		var timestamp = Date.now().toString();
		var url = "http://web.mta.info/status/serviceStatus.txt";
		request({
			url: url,
			method: 'GET'
		}, function (error, response, body) {
			parseString(body, function (err, result) {
				var lines = result.service.subway[0].line.filter( line => {
					line.color = self.getSubwayColor(line.name[0])
					// Return specific lines are all if none are set.
					return config.lines ? config.lines.indexOf(line.name[0]) > -1 : true;
				});
				self.sendSocketNotification('LINE_DATA', 
					{
						data: lines, 
						updated: result.service.timestamp
					}
				);
			});
		});


		this.scheduleTimer(self,config);
	},

	scheduleTimer: function(self, config) {
		clearTimeout(reloadTimer);
		reloadTimer = setTimeout( () => {
			this.getMTAData(self, config);
		}, config.fetchInterval);
	},

	getSubwayColor: function(subwayName) {

		if (subwayName === "123") {
			return "#F44336";	
		} else if (subwayName === "456") {
			return "#4CAF50";
		} else if (subwayName === "7") {
			return "#9C27B0";
		} else if (subwayName === "ACE") {
			return "#3F51B5";
		} else if (subwayName === "BDFM") {
			return "#FF9800";
		} else if (subwayName === "JZ") {
			return "#795548";
		} else if (subwayName === "G") {
			return "#00E676";
		} else if (subwayName === "L") {
			return "grey";
		} else if (subwayName === "NQR") {
			return "#FFC107";
		} else if (subwayName === "S") {
			return "#9E9E9E";
		} else if (subwayName === "SIR") {
			return "#0D47A1";
		}

		return "transparent";
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "GET_MTA_STATUS") {
			this.getMTAData(this, payload);	
		}		
	}




});