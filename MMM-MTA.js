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

	// Define required scripts.
	getStyles: function() {
		return ["MTA.css"];
	},

	// Make node_helper to get new warning-data
	getStatus: function (self) {
		console.log("HIAYA!!!!!!!!!!!!!!!!!!!!!!!!!!!")
		self.sendSocketNotification('GET_MTA_STATUS', self.config);		
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		
		this.linesData.map(line => {
			var container = document.createElement("div");
			if (line.status[0] === "DELAYS") {
				container.className = "animate-flicker";				
			}


			var background = document.createElement("div");
			//background.style = "color:"+line.color+"; padding:10px;"

			var text = document.createElement("div");		
			text.innerHTML = line.name[0] + ": " + line.status;
			text.style = "color: " + line.color;
			background.appendChild(text);


			container.appendChild(background);
       		wrapper.appendChild(container);    		

		});
		
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
