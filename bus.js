var id = "home";
var timetable;
var timetables = {};


// indicated index of first element
var index;

// count of results between standard display and shited one 
var shift = 0;

Number.prototype.mod = function(n) { 
	return ((this%n)+n)%n; 
}

window.onload = function() {
	fetchData("home");
	fetchData("work");
}

function onDataLoaded(data){
	timetables[data.tag] = {timetable: data.timetable, title: data.title};

	if (Object.keys(timetables).length == 2) {
		timetable = timetables[id].timetable;
		update();
    	setDirection(timetables[id].title);
		setInterval(update,  500);
	}
}

function onDirectionClick(){
   id = (id == "work")? "home" : "work";
   shift = 0;
   update();
}

function setDirection(title){
    var directionTag = document.getElementById('direction');
    directionTag.innerHTML = title;
 }
 
 function update(){
	timetable = timetables[id].timetable;
 	index = timetable.findIndex(notPast);
	if(index == -1) index = 1;
	
	setDirection(timetables[id].title);
    createList(timetable, index, 3);
	setTitle(index);
 }
 
 function setTitle(n){
	 var left = remains(timetable[n].hour, timetable[n].minute);
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

function onItemClick(item){
	if(item.target.getAttribute('id') == 'first') shift-=1;
	if(item.target.getAttribute('id') == 'last') shift+=1;
	if(item.target.getAttribute('id') == 'middle') shift=0;
	update();
}


// Function for List

function createList(schedule, index, count){
     var ul = document.getElementById("list");
     clearList();
     for(i = index+shift; i < index+count+shift; i++){
          var text = "";
          var li = document.createElement("li");
		  var n = i.mod(schedule.length);
          text += schedule[n].hour+":"+formatMinutes(schedule[n].minute);
		  
          if(index+shift >= index) text += " /"+formatMinutes(remains(schedule[n].hour, schedule[n].minute));
		  if(index+shift < index) text += " /"+formatMinutes(past(schedule[n].hour, schedule[n].minute));
		  
          li.appendChild(document.createTextNode(text));
		  li.addEventListener('click', onItemClick);
		  
		  if(i == index) li.setAttribute("class","marked");
          if(i == index+shift) li.setAttribute("id","first");
		  if(i > index+shift && i < index+count+shift-1) li.setAttribute("id","middle");
          if(i == index+count+shift-1) li.setAttribute("id","last");
		  
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
   if(deg>=10 || deg < 0) return deg;
   return ('0' + deg).slice(-2);
}

// false for past arrivals, true otherwise 
function notPast(item){
 var d = new Date();
 return (d.getMinutes()+(60*d.getHours())) <= (item.minute+(60*item.hour));
}

// return remain time to arrival in minutes

function past(hour,min){
    var d = new Date();
    var nhour = d.getHours()
    var nmin = d.getMinutes();
    return ((hour*60)+min)-((nhour*60)+nmin);
}

function remains(hour,min){
  var d = new Date();
  var nhour = d.getHours()
  var nmin = d.getMinutes();
  if (((hour*60)+min)>=((nhour*60)+nmin))
  return ((hour*60)+min)-((nhour*60)+nmin);
  else return (24*60-((nhour*60)+nmin))+((hour*60)+min);
}
