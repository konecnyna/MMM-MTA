/* global Module */

/* Magic Mirror
 * Module: MMM-MTA
 *
 * By Nicholas Konecny
 * MIT Licensed.
 */

Module.register("MMM-MTA",{

	start: function() {
		this.linesData = [];
		this.getStatus(this);		
	},

	getStyles: function() {
		return ["MTA.css"];
	},

	getStatus: function (self) {
		self.sendSocketNotification('GET_MTA_STATUS', self.config);		
	},

	getDom: function() {
		var wrapper = document.createElement("div");
		
		this.linesData.map(line => {
			var container = document.createElement("div");		

			var text = document.createElement("div");		
			text.innerHTML = line.name[0] + ": " + line.status;		
			if (line.status[0] === "DELAYS") {
				container.className = "animate-flicker";				
				text.style = "color: " + line.color;			
			}
				
			container.appendChild(text);
			wrapper.appendChild(container);    		

		});

		if (this.linesData && this.linesData.length > 0) {
			console.log(this.linesData[0]);
			var lastUpdated = document.createElement("div");			
			lastUpdated.innerHTML = "Last updated: " + this.linesData[0].Time;
			wrapper.appendChild(lastUpdated);			
		}
		
		return wrapper;
	},

	socketNotificationReceived: function (notification, payload) {
		Log.info(notification);
		if (notification === 'LINE_DATA') {
			this.linesData = payload.data;
			this.updateDom(50);
		}
	}
});
