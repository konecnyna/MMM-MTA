"use strict";

class MtaView {

    constructor (linesData, updated, config) {
        this.linesData = linesData;
        this.config = config;
        this.helper = new MtaHelper(config);
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

			table.appendChild(this.helper.createLineCircles(line));			
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
		if (line.status !== "DELAYS") {
			return "";
		}
		
		var sanatizedText = this.helper.stripHTML(line.text);		
		return sanatizedText.replace(/\[(.*?)\]/g, ($0, $1) => {					
			return this.helper.createLineCircle($1, line.status[0]).outerHTML					
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
		lastUpdatedDiv.innerHTML = "Last updated: " + moment().format('MMMM Do YYYY, h:mm:ss a');
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

}