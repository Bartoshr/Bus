var id = 'home';
var timetable;
var timetables = {};


// indicated index of first element
var index;

// count of results between standard display and shited one
var shift = 0;

// index of bus arrivel which should be diplayed in notification
var notifyIndex = -1;

Number.prototype.mod = function(n) {
	return ((this % n) + n) % n;
};

window.onload = function() {
	
	fetchData('home');
	fetchData('work');
	
	if ('serviceWorker' in navigator) {
	     navigator.serviceWorker.register('/sw.js').then(function(registration) {
	      // Registration was successful
	      console.log('ServiceWorker registration successful with scope: ', registration.scope);
	    }, function(err) {
	      // registration failed :(
	      console.log('ServiceWorker registration failed: ', err);
	    });
	}
};

function onDataLoaded(data) {
	timetables[data.tag] = {timetable: data.timetable, title: data.title};

	if (Object.keys(timetables).length == 2) {
		timetable = timetables[id].timetable;
		update();
    	setDirection(timetables[id].title);
		setInterval(update, 500);
	}
}

function onDirectionClick() {
   id = (id == 'work') ? 'home' : 'work';
   shift = 0;
   notifyIndex = -1;
   update();
}

function setDirection(title) {
    var directionTag = document.getElementById('direction');
    directionTag.innerHTML = title;
 }

 function update() {
	timetable = timetables[id].timetable;
 	index = timetable.findIndex(notPast);
	if (index == -1) index = 1;

	setDirection(timetables[id].title);
    createList(timetable, index, 3);
	setTitle(index);
	showNotification(index);
 }

 function setTitle(n) {
	 var left = remains(timetable[n].hour, timetable[n].minute);
	 document.title = 'Bus / '+ left + ' min';
 }

function fetchData(id) {
	var url = 'https://script.google.com/macros/s/AKfycbxHXrx9YLhONoVk9ZXz9YrvMVJhkk-qI7RwRZv3EM8DYdObrqc/exec?callback=onDataLoaded&direction='+ id;
	var newScript = document.createElement('script');
	newScript.setAttribute('src', url);
	newScript.setAttribute('id', 'jsonp');

	var oldScript = document.getElementById('jsonp');
	var head = document.getElementsByTagName('head')[0];
	if (oldScript == null) {
		head.appendChild(newScript);
	} else {
		head.replaceChild(newScript, oldScript);
	}
}

function onItemClick(item) {
	if (item.target.getAttribute('id') == 'first') shift -= 1;
	if (item.target.getAttribute('id') == 'last') shift += 1;
	if (item.target.getAttribute('id') == 'middle') shift = 0;
	update();
}

function onItemLongPress(item) {
	var localIndex = 0;
	if (item.target.getAttribute('id') == 'first') localIndex = 0;
	if (item.target.getAttribute('id') == 'last') localIndex = 2;
	if (item.target.getAttribute('id') == 'middle') localIndex = 1;
	notifyIndex = index+localIndex+shift;
	update();
}

function showNotificationOnTime(n) {
	var left = remains(timetable[n].hour, timetable[n].minute);
	console.log("left : "+left+", n = "+n+" notifyIndex: "+notifyIndex);
	if (left <= 10 && notifyIndex == n) {
		if (window.Notification && Notification.permission !== 'denied') {
			Notification.requestPermission(function(status) {  // status is "granted", if accepted by user
				var n = new Notification('Bus / '+ left + ' min', {
					body: 'Hurry up',
					icon: 'icons/ic_launcher_96.png' // optional
				});
			});
		}
		notifyIndex = -1;
	}
}

function showNotification(n) {
	var left = remains(timetable[n].hour, timetable[n].minute);
	console.log("left : "+left+", n = "+n+" notifyIndex: "+notifyIndex);
	if (left <= 10 && notifyIndex == n) {
		Notification.requestPermission(function(result) {
		  if (result === 'granted') {
		    navigator.serviceWorker.ready.then(function(registration) {
		      registration.showNotification('Bus / '+ left + ' min', {
		        icon: 'icons/ic_launcher_96.png'
		      });
		    });
		  }
		});
		notifyIndex = -1;
	}
}



// Function for List

function createList(schedule, index, count) {
     var ul = document.getElementById('list');
     clearList();
     for (i = index + shift; i < index + count + shift; i++) {
          var text = '';
          var li = document.createElement('li');
		  var n = i.mod(schedule.length);
          text += schedule[n].hour + ':'+ formatMinutes(schedule[n].minute);

          if (index + shift >= index) text += ' /'+ formatMinutes(remains(schedule[n].hour, schedule[n].minute));
		  if (index + shift < index) text += ' /'+ formatMinutes(past(schedule[n].hour, schedule[n].minute));

          li.appendChild(document.createTextNode(text));
		  li.addEventListener('click', onItemClick)
		  li.addEventListener('mousedown', onItemLongPressDisp);
		  li.addEventListener('mouseup', revert);
		  li.addEventListener('touchstart', onItemLongPressDisp);
		  li.addEventListener('touchend', revert);
		  li.addEventListener('touchcancel', revert);

		  if (i == index) li.setAttribute('class', 'marked');
          if (i == index + shift) li.setAttribute('id', 'first');
		  if (i > index + shift && i < index + count + shift - 1) li.setAttribute('id', 'middle');
          if (i == index + count + shift - 1) li.setAttribute('id', 'last');
		  if (i == notifyIndex) li.setAttribute('class', 'ringing');

          ul.appendChild(li);
       }
}

function clearList() {
   var myNode = document.getElementById('list');
     while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
      }
}


// Helper functions

 // add 0 to numbers below 10
 function formatMinutes(deg) {
   if (deg >= 10 || deg < 0) return deg;
   return ('0' + deg).slice(-2);
}

// false for past arrivals, true otherwise
function notPast(item) {
 var d = new Date();
 return (d.getMinutes() + (60 * d.getHours())) <= (item.minute + (60 * item.hour));
}

// return remain time to arrival in minutes

function past(hour, min) {
    var d = new Date();
    var nhour = d.getHours();
    var nmin = d.getMinutes();
    return ((hour * 60) + min) - ((nhour * 60) + nmin);
}

function remains(hour, min) {
  var d = new Date();
  var nhour = d.getHours();
  var nmin = d.getMinutes();
  if (((hour * 60) + min) >= ((nhour * 60) + nmin))
  return ((hour * 60) + min) - ((nhour * 60) + nmin);
  else return (24 * 60 - ((nhour * 60) + nmin)) + ((hour * 60) + min);
}

// Long Press Helper Functions

var timer;
var istrue = false;
var delay = 1000; // how much long u have to hold click in MS
function onItemLongPressDisp(item)
{
   istrue = true;
   timer = setTimeout(function(){ 
       if(timer)
       clearTimeout(timer);   
       if(istrue)
       {
           onItemLongPress(item);
       }
   }, delay);
}

function revert()
{
   istrue = false;
}

