/* global Module */

/* Magic Mirror
 * Module: MMM-MTA
 *
 * By Nicholas Konecny
 * MIT Licensed.
 */

Module.register("MMM-MTA", {

	start: function() {
		this.linesData = [];
		this.nextTrainData = [];
		this.lastUpdated = "Loading...";
		this.getStatus(this);
		this.mtaRealtime = new MtaRealtime();
	},

	getStyles: function() {
		return ["MTA.css", "moment.js"];
	},

	getStatus: function (self) {
		self.sendSocketNotification('GET_MTA_STATUS', self.config);		
	},

	getScripts: function() {
		return [
			this.file('public/mta-view.js'), 
			this.file('public/mta-realtime.js'),
			this.file('public/mta-helper.js')
		];
	},

	getDom: function() {
		const view = document.createElement("div");
		view.className = "medium";
		
		const mtaView = new MtaView(this.linesData, this.lastUpdated, this.config);
		view.appendChild(mtaView.build(this.nextTrainData));
		
		
		view.appendChild(this.mtaRealtime.build(this.nextTrainData));

		return view;
	},



	socketNotificationReceived: function (notification, payload) {
		if (notification === 'LINE_DATA') {
			this.linesData = payload.data;
			this.lastUpdated = payload.updated;
			this.updateDom();
		}
console.log("-------------11111111111111111111--------->",payload)
		if (notification === 'NEXT_TRAIN_DATA') {						
			this.nextTrainData = payload;			
			this.updateDom();
			console.log("-------------11111111111111111111--------->",payload)
		}


		if (notification === 'UPDATE_CLOCK') {
			var minutes = payload.data.minutes;
			var seconds = payload.data.seconds;

			if (minutes < 10) {
				minutes = `0${minutes}`
			}

			if (seconds < 10) {
				seconds = `0${seconds}`
			}

			var formattedTime = moment.unix(payload.time).format("hh:mm:ss a");

			this.mtaRealtime.updateTime("Departs in " + minutes + ":" + seconds + " minutes (" + formattedTime + ")");
			
		}
	}
});
