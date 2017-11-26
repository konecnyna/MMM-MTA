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
			
		if (this.nextTrainData.length > 2) {
			var title = document.createElement("h2");		
			title.innerHTML = "Next North bound F trains:"
			container.appendChild(title);			
			container.appendChild(document.createElement("hr"));

			for (var i=0; i < 3; i++) {
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
	}
});
