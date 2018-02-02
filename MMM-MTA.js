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
		this.timeDiv = document.createElement("div");
	},

	getStyles: function() {
		return ["MTA.css", "moment.js"];
	},

	getStatus: function (self) {
		self.sendSocketNotification('GET_MTA_STATUS', self.config);		
	},

	getScripts: function() {
		return [
			this.file('public/mta-view.js')		
		];
	},

	getDom: function() {
		const container = new MtaView(this.linesData, this.lastUpdated, this.config).build();
				
		var title = document.createElement("h2");		
		title.innerHTML = "Next North bound F trains:"
		container.appendChild(title);			
		container.appendChild(document.createElement("hr"));

		
		this.timeDiv = document.createElement("div");
		this.timeDiv.style.textAlign = "right";
		container.appendChild(this.timeDiv);	


		if (this.nextTrainData.length > 3) {
			for (var i = 1; i < 3; i++) {
				var div = document.createElement("div");						
				var dateString = moment.unix(this.nextTrainData[i].departureTime).format("hh:mm:ss a");
				div.style.textAlign = "right";
				div.innerHTML = dateString;
				container.appendChild(div);	
			}			
		}
	

		return container;
	},


	socketNotificationReceived: function (notification, payload) {
		if (notification === 'LINE_DATA') {
			this.linesData = payload.data;
			this.lastUpdated = payload.updated;
			this.updateDom();
		}

		if (notification === 'NEXT_TRAIN_DATA') {
			this.nextTrainData = payload;
			this.updateDom();
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

			this.timeDiv.innerHTML = "Departs in " + minutes + ":" + seconds + " minutes (" + formattedTime + ")";
			
		}
	}
});
