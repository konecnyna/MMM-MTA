"use strict";

class MtaRealtime {

    constructor (config) {       
        this.helper = new MtaHelper(config);
        this.timeDiv = document.createElement("div");   
        this.nextTrains = document.createElement("div");   
    }

    build(nextTrainData) {
    	var wrapper = document.createElement("div");    	
    	if (!nextTrainData) {
    		wrapper.appendChild(loading);
    		return wrapper;
    	}
    	
		
		var table = document.createElement("table");		
		var tr = document.createElement("tr");

		var td = document.createElement("td");
		var td2 = document.createElement("td");


		var icon = this.helper.createLineCircle("F","DELAYS");		

		var title = document.createElement("div");

		wrapper.appendChild(document.createElement("p"));	

		title.innerHTML = "Next North bound trains:";
		title.style = "font-weight:bold;";
		title.className = "medium";
		
		td.appendChild(icon);
		td2.appendChild(title);
		tr.appendChild(td);
		tr.appendChild(td2);
		table.appendChild(tr);
		
		
		wrapper.appendChild(table);
		wrapper.appendChild(document.createElement("hr"));

		
		
		this.timeDiv.style.textAlign = "right";
		wrapper.appendChild(this.timeDiv);	
		
		
		this.updateTrains(this.nextTrains);
		
		wrapper.appendChild(this.nextTrains);

		return wrapper;
    }

    updateTrains(nextTrainData) {    	
    	this.nextTrains.innerHTML = '';
    	if(!nextTrainData || !nextTrainData.length) {
    		var loading = document.createElement("div");    	
    		loading.innerHTML = "<h4> Loading... </h4>";
    		this.nextTrains.appendChild(loading);
    		return;
    	}

    	if (nextTrainData.length > 1) {
			for (var i = 1; i < nextTrainData.length; i++) {
				var div = document.createElement("div");						
				var dateString = moment.unix(nextTrainData[i].departureTime).format("hh:mm:ss a");

				if (this.timeDiv.innerHTML.indexOf(dateString) !== -1) {
					continue;
				}

				div.style.textAlign = "right";
				div.innerHTML = dateString;
				this.nextTrains.appendChild(div);	
				if (i === 3) {
					break;
				}
			}			
		}
    }

    updateTime(html) {
    	this.timeDiv.innerHTML = html;    	
    }

}