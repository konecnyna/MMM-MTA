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
		this.lastUpdated = "Loading...";
		this.getStatus(this);		
	},

	getStyles: function() {
		return ["MTA.css"];
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
		return new MtaView(this.linesData, this.lastUpdated, this.config).build();
	},


	socketNotificationReceived: function (notification, payload) {
		if (notification === 'LINE_DATA') {
			this.linesData = payload.data;
			this.lastUpdated = payload.updated;
			this.updateDom();
		}
	}
});
