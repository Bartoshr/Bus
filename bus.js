var id = "home";
var timetable;

window.onload = function() {
	// handleRefresh();
	// setInterval(handleRefresh, 3000);
	fetchData();
}

function loadTimetable(data){
	timetable = data.timetable;
	var index = data.timetable.findIndex(notPast);
    createList(timetable, index, 3);
	
    var directionTag = document.getElementById('direction');
    directionTag.innerHTML = data.title;
	
	setInterval(update,  500);
}

function onDirectionClick(){
   id = (id == "work")? "home" : "work";
   fetchData();
}

function getDirection(){
    return document.getElementById('path').innerHTML;
 }
 
 function update(){
 	var index = timetable.findIndex(notPast);
    createList(timetable, index, 3);
 }
 
 function notPast(item){
	 var d = new Date();
	 return (d.getMinutes()+(60*d.getHours())) <= (item.minute+(60*item.hour));
 }

function fetchData(){
	var url = "https://script.google.com/macros/s/AKfycbxLfPvkUE6x_ROTRVU_UjlZojvj71TYJdWonQj_dFc/exec?callback=loadTimetable&direction="+id;
		
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

 // add 0 to numbers below 10
 function formatMinutes(deg){
   if(deg>=10) return deg;
   return ('0' + deg).slice(-2);
}