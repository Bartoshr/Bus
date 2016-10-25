
var lastMinute = -1;
var id = "home";

window.onload = function() {
	// handleRefresh();
	// setInterval(handleRefresh, 3000);
	update();
	setInterval(function() {
		  var minute = (new Date()).getMinutes();
		  if(lastMinute != minute){
		      update();
		      lastMinute=minute;
		    }
	},  100);
}

function updateSchedule(data){
    createList(data.timetable, data.next, 3); 
    var directionTag = document.getElementById('direction');
    directionTag.innerHTML = data.title;
}

function onDirectionClick(){
   id = (id == "work")? "home" : "work";
   update();
}

function getDirection(){
    return document.getElementById('path').innerHTML;
 }

function update(){
	var url = "https://script.google.com/macros/s/AKfycbxLfPvkUE6x_ROTRVU_UjlZojvj71TYJdWonQj_dFc/exec?callback=updateSchedule&direction="+id;
		
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