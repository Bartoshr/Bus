var id = "home";
var timetable;
var timetables = {};

window.onload = function() {
	fetchData("home");
	fetchData("work");
}

function onDataLoaded(data){
	timetables[data.tag] = {timetable: data.timetable, title: data.title};
	console.log(Object.keys(timetables).length);
		
	if (Object.keys(timetables).length == 2) {
		timetable = timetables[id].timetable;
		update();
    	setDirection(timetables[id].title);
		setInterval(update,  500);
	}
}

function onDirectionClick(){
   id = (id == "work")? "home" : "work";
   update();
}

function setDirection(title){
    var directionTag = document.getElementById('direction');
    directionTag.innerHTML = title;
 }
 
 function update(){
	timetable = timetables[id].timetable;
 	var index = timetable.findIndex(notPast);
	setDirection(timetables[id].title);
    createList(timetable, index, 3);
	setTitle(index);
 }
 
 function setTitle(n){
	 var left = remains(timetable[n].hour, timetable[n].minute)
	 document.title = "Bus / "+left+" min";
 }

function fetchData(id){
	var url = "https://script.google.com/macros/s/AKfycbxLfPvkUE6x_ROTRVU_UjlZojvj71TYJdWonQj_dFc/exec?callback=onDataLoaded&direction="+id;	
	var newScript = document.createElement("script");
	newScript.setAttribute("src", url);
	newScript.setAttribute("id","jsonp");
	
	var oldScript = document.getElementById("jsonp");
	var head = document.getElementsByTagName("head")[0];
	if(oldScript == null) {
		head.appendChild(newScript);
	} else {
		head.replaceChild(newScript, oldScript);
	}
}


// Function for List

function createList(schedule, index, count){
     var ul = document.getElementById("list");
     clearList();
     for(i = index; i < index+count; i++){
          var text = "";
          var li = document.createElement("li");
		  var n = i%schedule.length;
          text += schedule[n].hour+":"+formatMinutes(schedule[n].minute);
          text += " /"+formatMinutes(remains(schedule[n].hour, schedule[n].minute));
          li.appendChild(document.createTextNode(text));
          if(i == index) { 
            li.setAttribute("class","first");
          }
          ul.appendChild(li);
       }
}

function clearList(){
   var myNode = document.getElementById("list");
     while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
      } 
}


// Helper functions 

 // add 0 to numbers below 10
 function formatMinutes(deg){
   if(deg>=10) return deg;
   return ('0' + deg).slice(-2);
}

// false for past arrivals, true otherwise 
function notPast(item){
 var d = new Date();
 return (d.getMinutes()+(60*d.getHours())) <= (item.minute+(60*item.hour));
}

// return remain time to arrival in minutes
function remains(hour,min){
  var d = new Date();
  var nhour = d.getHours()
  var nmin = d.getMinutes();
  if(nhour == hour) {
          return (min-nmin);
    } else {
          var dhour = Math.abs(hour-nhour);
          return ((dhour*60)-nmin)+min;
   }
}
