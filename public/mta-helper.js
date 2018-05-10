'use strict';

class MtaHelper {
  constructor(config) {
    this.config = config;
  }

  getSubwayColor(train) {
    if (this.matchSubway(train, '123')) {
      return '#F44336';
    } else if (this.matchSubway(train, '456')) {
      return '#4CAF50';
    } else if (this.matchSubway(train, '7')) {
      return '#9C27B0';
    } else if (this.matchSubway(train, 'ACE')) {
      return '#3F51B5';
    } else if (this.matchSubway(train, 'BDFM')) {
      return '#FF9800';
    } else if (this.matchSubway(train, 'JZ')) {
      return '#795548';
    } else if (this.matchSubway(train, 'G')) {
      return '#00E676';
    } else if (this.matchSubway(train, 'L')) {
      return 'grey';
    } else if (this.matchSubway(train, 'NQR')) {
      return '#FFC107';
    } else if (train === 'S') {
      // False positive for SIR so check here.
      return '#9E9E9E';
    } else if (train === 'SIR') {
      return '#0D47A1';
    }

    return 'transparent';
  }

  matchSubway(train, line) {
    return line.includes(train) || train === line;
  }

  createLineCircles(line) {
    var row = document.createElement('tr');
    if (line.status === 'DELAYS') {
      if (this.config.delayAlertFlash) {
        row.className = 'animate-flicker';
      }
      row.style = 'color: red';
    }

    var circles = document.createElement('div');
    line.name.split('').map(lineName => {
      circles.appendChild(this.createLineCircle(lineName, line.status));
    });

    var col1 = document.createElement('td');
    var col2 = document.createElement('td');

    col1.style = 'float:left; padding-right: 16px';
    col1.appendChild(circles);
    col2.style = 'float:right;';
    col2.innerHTML = line.status;

    row.appendChild(col1);
    row.appendChild(col2);
    return row;
  }

  createLineCircle(lineName, status) {
    var circle = document.createElement('div');
    circle.className = 'circle';
    circle.innerHTML = lineName;        
    if (status === 'DELAYS' || this.config.colors === true) {
      circle.style = 'background-color: ' + this.getSubwayColor(lineName) + '; color:white;';
    }

    return circle;
  }

  stripHTML(html) {
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
}
