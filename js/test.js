$(document).on('click','.button_test',function(){
	//curTimestamp = new Date();
	//curDate = ("0" + curTimestamp.getDate()).slice(-2) + '/' + ("0" + (curTimestamp.getMonth()+1)).slice(-2) + '/' + curTimestamp.getFullYear();
	//alert(curDate);
	//curTime = ("0" + curTimestamp.getHours()).slice(-2) + ':' + ("0" + curTimestamp.getMinutes()).slice(-2);
	//alert(curTime);
	
	//window.localStorage.setItem("key", "value");
    //alert(window.localStorage.getItem("key"));
    //window.localStorage.removeItem("key");
    //window.localStorage.clear();
    // localStorage is now empty
	
	//window.localStorage.setItem("backendDomain", "http://ren.sky37.pp.ua");
	//window.localStorage.setItem("userLogin", "renat");
	
	
	//$('#button_login').hide();
	
	//$("#user_logged_status").toggleClass("loggedIn");

    
    
    


//var networkState = navigator.connection.type;

//var states = {};
//states[Connection.UNKNOWN]  = 'Unknown connection';
//states[Connection.ETHERNET] = 'Ethernet connection';
//states[Connection.WIFI]     = 'WiFi connection';
//states[Connection.CELL_2G]  = 'Cell 2G connection';
//states[Connection.CELL_3G]  = 'Cell 3G connection';
//states[Connection.CELL_4G]  = 'Cell 4G connection';
//states[Connection.CELL]     = 'Cell generic connection';
//states[Connection.NONE]     = 'No network connection';

//alert('Connection type: ' + states[networkState]);

    
    
    
    
    
    
    
//alert(window.localStorage.getItem("servicesToken"));



//var tz = jstz.determine(); // Determines the time zone of the browser client
//alert(tz.name());

//alert(Date.parse("2013-05-29 01:22:55"));
//timezoneOffset = 14400 * 1000;
//timezoneOffset = 0;
//dateTimePlanned = new Date(Date.parse("2013-05-29 01:22:55") + timezoneOffset);
//dateTimePlanned = new Date(Date.parse("2013-05-29 01:22:55"));
//alert(dateTimePlanned);
//var tst5 = dateTimePlanned.getFullYear() + '-' + 
//           ("0" + (dateTimePlanned.getMonth() + 1)).slice(-2) + '-' + 
//           ("0" + dateTimePlanned.getDate()).slice(-2) + ' ' + 
//           ("0" + dateTimePlanned.getHours()).slice(-2) + '-' +
//           ("0" + dateTimePlanned.getMinutes()).slice(-2) + '-' +
//           ("0" + dateTimePlanned.getSeconds()).slice(-2);
//alert(tst5);
//alert(dateTimePlanned);



//$("#page_settings").attr("data-tst5", "startTime");
//alert($("#page_settings").attr("data-tst5"));






// Create DB and fill it with records
var testdb = TAFFY([
	{"id":1,"val2":2,"value":"Active"},
	{"id":2,"val2":2,"value":"Lost"}
]);

var kelly = testdb({id:2}).first();
//alert(kelly.value);


//var funcName2='varfuncname';
//window[funcName2]=function() {
//    alert('HI!');
//}
//window[funcName]();

//var cities = activitiesTDB().select("nid");
//alert(cities[0]);
//alert(cities.length);


//nodeDateTimePlanned = new Date(Date.parse("2013-07-04 16:00:48"));
//alert(nodeDateTimePlanned);
//alert(Date.parse("2013-07-04 16:00:48"));






//navigator.notification.beep(2);

//alert('a');
//var newPlannedEndDateTime = new Date(Date.parse("2013-07-04 16:00:48"));
//alert(newPlannedEndDateTime);
//newPlannedEndDateTime.setDate(newPlannedEndDateTime.getDate() + 1);
//alert(newPlannedEndDateTime);
	
	
	
	//alert(getNewTDBEntryID("activitiesTDB"));
	
	



    //var curActivityEntry2 = activitiesTDB({id:1}).first();
	//alert(curActivityEntry2.id);
	//alert(curActivityEntry2.nid);
	//alert(curActivityEntry2.title);
	//alert(curActivityEntry2.priority);





// Options: throw an error if no update is received every 30 seconds.
//
//var watchID = navigator.geolocation.watchPosition(onSuccess7, onError7, { enableHighAccuracy:true, timeout: 30000 });
////navigator.geolocation.getCurrentPosition(onSuccess7, onError7, { enableHighAccuracy:true, timeout: 30000 });




    //navigator.onLine will always return True at desktop Linux, and at Chrome for Android
    if (navigator.onLine) {
        alert('online');
    } else {
        alert('offline');
    }




})





// onSuccess Callback
//   This method accepts a `Position` object, which contains
//   the current GPS coordinates
//
function onSuccess7(position) {
    //var element = document.getElementById('geolocation');
    //element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
    //                    'Longitude: ' + position.coords.longitude     + '<br />' +
    //                    '<hr />'      + element.innerHTML;
    //alert("Lat: " + position.coords.latitude + " Lon: " + position.coords.longitude);

    setInterval(function(){alert("Lat: " + position.coords.latitude + " Lon: " + position.coords.longitude)},10000);
}

// onError Callback receives a PositionError object
//
function onError7(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}








//$(document).on("pagehide", "div[data-role=page]", function(event){
//    alert('78');
  //$(event.target).remove();
//});

//$("div").on("pageshow", function(event, ui){
//    alert($(this).attr('id'));
    //alert("a");
//});