"use strict";

class MtaView {

    constructor (linesData, updated, config) {
        this.linesData = linesData;
        this.lastUpdated = updated;
        this.config = config;
    }

    build() {
    	var wrapper = document.createElement("div");
		wrapper.className = "mta";		
		var table = document.createElement("table");		
		var delaysText = "";

		this.linesData.map(line => {			
			delaysText += this.getDelaysText(line);							
			if (this.config.show_delays_only && line.status[0] !== "DELAYS") {
				return;
			}

			table.appendChild(this.createLineCircles(line));			
		});
		
		
		if (table.childNodes.length === 0) {
			wrapper.appendChild(this.makeAllClearDiv());
		} else {
			wrapper.appendChild(table);	
			this.addDelayMarquee(wrapper, delaysText);
		}
		
		return wrapper;
    }

    getDelaysText(line) {
		if (line.status[0] !== "DELAYS") {
			return "";
		}
		
		var sanatizedText = this.stripHTML(line.text[0]);		
		return sanatizedText.replace(/\[(.*?)\]/g, ($0, $1) => {					
			return this.createLineCircle($1, line.status[0]).outerHTML					
		});			
    }

    makeAllClearDiv(wrapper) {
    	var lastUpdatedDiv = document.createElement("div");
    	lastUpdatedDiv.innerHTML = "<h1>All good in the hood</h1>";
    	return lastUpdatedDiv;
    }

    addDelayMarquee(wrapper, delaysText) {
    	var lastUpdatedDiv = document.createElement("div");			
		lastUpdatedDiv.className = "updated-text";
		lastUpdatedDiv.innerHTML = "Last updated: " + this.lastUpdated;
	    wrapper.appendChild(lastUpdatedDiv);			
		if (delaysText) {
			// Divider
			wrapper.appendChild(document.createElement("hr"));
			var div = document.createElement("div");
			div.className = "delays";
			div.innerHTML = delaysText;
			wrapper.appendChild(div);
		}
    }

    createLineCircles(line) {
    	var row = document.createElement("tr");			
		if (line.status[0] === "DELAYS") {
			if (this.config.delay_alert_flash) {
				row.className = "animate-flicker";					
			}
			row.style = "color: red";		
		}

		var circles = document.createElement("div");
		line.name[0].split("").map(lineName => {				
			circles.appendChild(this.createLineCircle(lineName, line.status[0]));
		});
		
		var col1 = document.createElement("td");		
		var col2 = document.createElement("td");

		col1.style = "float:left; padding-right: 16px";
		col1.appendChild(circles);
		col2.style = "float:right;";
		col2.innerHTML = line.status;

		row.appendChild(col1);
		row.appendChild(col2);
		return row;
    }
	createLineCircle(lineName, status) {
		var circle = document.createElement("div");
		circle.className = "circle";
		circle.innerHTML = lineName;	
		if (status === "DELAYS") {
			circle.style = "background-color: " + this.getSubwayColor(lineName) + "; color:white;"
		}

		return circle;
	}

    stripHTML(html) {
	   var tmp = document.createElement("div");
	   tmp.innerHTML = html;
	   return tmp.textContent || tmp.innerText || "";
	}

	getSubwayColor(train) {
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
	}

	matchSubway(train, line) {
		return line.includes(train) || train === line;
	}
}