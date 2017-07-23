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
		

		var table = document.createElement("table");
		table.className = "mta";

		var delaysText;

		this.linesData.map(line => {
			var row = document.createElement("tr");
			table.appendChild(row);

			var circles = "";
			line.name[0].split("").map(lineName => {
				circles += "<div class='circle'>" + lineName + "</div>";
			});
			
			var col1 = document.createElement("td");		
			var col2 = document.createElement("td");

			col1.style = "float:left;";
			col1.innerHTML = circles;
			col2.innerHTML = line.status;

			if (line.status[0] === "PLANNED WORK") {
				row.className = "animate-flicker";				
				row.style = "color: red";
				delaysText = line.text[0];				
			}	
			row.appendChild(col1);
			row.appendChild(col2);					
		});

		wrapper.appendChild(table);

		if (this.linesData && this.linesData.length > 0) {
			var lastUpdated = document.createElement("div");			
			lastUpdated.innerHTML = "Last updated: " + this.linesData[0].Time;
			wrapper.appendChild(lastUpdated);			
		}
		
		if (delaysText) {
			var marquee = document.createElement("marquee");
			marquee.style = "white-space: nowrap;"
			marquee.innerText = delaysText;
			//wrapper.appendChild(marquee);
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
