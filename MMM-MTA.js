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

	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.className = "mta";
		
		var table = document.createElement("table");		
		var delaysText = "";

		this.linesData.map(line => {
			var row = document.createElement("tr");
			table.appendChild(row);

			if (line.status[0] === "DELAYS") {
				row.className = "animate-flicker";				
				row.style = "color: red";

				var sanatizedText = this.stripHTML(line.text[0]);
				if (delaysText.length !== 0) {
					delaysText += " ---- ";
				}
				delaysText += sanatizedText.replace(/\[(.*?)\]/g, ($0, $1) => {					
					return this.createLineCircle($1, line.status[0]).outerHTML					
				});			
				delaysText += " ";		
			}	

			var circles = document.createElement("div");
			line.name[0].split("").map(lineName => {				
				circles.appendChild(this.createLineCircle(lineName, line.status[0]));
			});
			
			var col1 = document.createElement("td");		
			var col2 = document.createElement("td");

			col1.style = "float:left;";
			col1.appendChild(circles);
			col2.style = "float:right;";
			col2.innerHTML = line.status;


			row.appendChild(col1);
			row.appendChild(col2);					
		});
		wrapper.appendChild(table);



		var lastUpdated = document.createElement("div");			
		lastUpdated.className = "updated-text";
		lastUpdated.innerHTML = "Last updated: " + this.lastUpdated;
	    wrapper.appendChild(lastUpdated);			
	

		if (delaysText) {
			// Divider
			wrapper.appendChild(document.createElement("hr"));

			var marquee = document.createElement("marquee");
			marquee.className = "marquee";
			
			var att = document.createAttribute("scrollamount");
		    att.value = "20";
		    marquee.setAttributeNode(att);

			marquee.innerHTML = delaysText;
			wrapper.appendChild(marquee);
		}
		
		
		return wrapper;
	},

	createLineCircle: function(lineName, status) {
		var circle = document.createElement("div");
		circle.className = "circle";
		circle.innerHTML = lineName;	
		if (status === "DELAYS") {
			circle.style = "background-color: " + this.getSubwayColor(lineName) + "; color:white;"
		}

		return circle;
	},

	stripHTML: function(html) {
	   var tmp = document.createElement("div");
	   tmp.innerHTML = html;
	   return tmp.textContent || tmp.innerText || "";
	},

	getSubwayColor: function(train) {
		if (this.matchSubway(train, "123")) {
			return "#F44336";	
		} else if (this.matchSubway(train, "456")) {
			return "#4CAF50";
		} else if (this.matchSubway(train, "7")) {
			return "#9C27B0";
		} else if (this.matchSubway(train, "ACE")) {
			return "#3F51B5";
		} else if (this.matchSubway(train, "BDFM")) {
			return "#FF9800";
		} else if (this.matchSubway(train, "JZ")) {
			return "#795548";
		} else if (this.matchSubway(train, "G")) {
			return "#00E676";
		} else if (this.matchSubway(train, "L")) {
			return "grey";
		} else if (this.matchSubway(train, "NQR")) {
			return "#FFC107";
		} else if (train === "S") { // False positive for SIR so check here.
			return "#9E9E9E";
		} else if (train === "SIR") {
			return "#0D47A1";
		}

		return "transparent";
	},

	matchSubway: function(train, line) {
		return line.includes(train) || train === line;
	},

	socketNotificationReceived: function (notification, payload) {
		Log.info(notification);
		if (notification === 'LINE_DATA') {
			this.linesData = payload.data;
			this.lastUpdated = payload.updated;
			this.updateDom(50);
		}
	}
});
