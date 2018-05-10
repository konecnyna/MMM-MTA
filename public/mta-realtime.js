"use strict";

class MtaRealtime {

    constructor () {       
        this.helper = new MtaHelper();
        this.timeDiv = document.createElement("div");      
    }

    build(nextTrainData) {
    	var wrapper = document.createElement("div");
    	console.log(nextTrainData);
    	if (!nextTrainData) {
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
		

		if (nextTrainData.length > 3) {
			for (var i = 1; i < 4; i++) {
				var div = document.createElement("div");						
				var dateString = moment.unix(nextTrainData[i].departureTime).format("hh:mm:ss a");
				div.style.textAlign = "right";
				div.innerHTML = dateString;
				wrapper.appendChild(div);	
			}			
		}

		return wrapper;
    }

    updateTime(html) {
    	this.timeDiv.innerHTML = html;    	
    }

}