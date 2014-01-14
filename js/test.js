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
    
    //var testvar = activitiesTDB().first();
    //alert(testvar.title);
    
    
    
    //Get current Date and Time
    var curDateTime = new Date();
    //Months numbers counts from 0, not from 1
    var curDayStart = curDateTime.getFullYear() + '/' + ("0" + (curDateTime.getMonth()+1)).slice(-2) + '/' + ("0" + curDateTime.getDate()).slice(-2) + " 00:00:00";
    var plannedStartTimestamp = Date.parse(curDayStart);
    //var curDayEnd = curDateTime.getFullYear() + '-' + ("0" + (curDateTime.getMonth()+1)).slice(-2) + '-' + ("0" + curDateTime.getDate()).slice(-2) + " 23:59:59";
    //var plannedEndTimestamp = Date.parse(curDayEnd);
    
    //alert(curDayStart);
    //alert(plannedStartTimestamp);
    //alert(Date.parse("Thu, 01 Jan 1970 00:00:00 GMT-0400"));
    
    //alert("2013-12-07 00:00:00: " + Date.parse("2013/12/07 00:00:00"));
    //alert("2013-12-07 00:00:00: " + Date.parse("2013-12-07 00:00:00"));
    
    //alert("2013-12-07T00:00:00: " + Date.parse("2013-12-07T00:00:00Z"));
    //alert("2013-12-07T00:00:00: " + Date.parse("2013-12-07T00:00:00"));
    //alert("2013-12-07T00:00:00+04:00: " + Date.parse("2013-12-07T00:00:00+04:00"));
    //alert("2013-12-07: " + Date.parse("2013-12-07"));
    
    
    
    
    //alert(moment("2013-12-07 00:00:00"));
    //alert(moment());
    //alert(moment.parseZone("2013-01-01T00:00:00-13:00").zone());
    //alert(moment({hour: 23, minute: 59, seconds: 59}));
    //alert(moment().add('days', 1).startOf('day').format());
    
    //alert(moment().add('days', 1).startOf('day').format('X'));
    
    //alert(moment().add('days', 1).startOf('day').unix);
    //alert(moment([2070, 11, 17]).fromNow());
    
    //alert(moment().add('days', -1).endOf('day'));
    //alert(moment({hour: 0, minute: 0, seconds: 0}));
    //alert(moment().day(3));
    
    //alert(moment().startOf('day').format());
    //alert(moment(new Date()).format('YYYY-MM-DD'));
    //alert(moment(new Date()).format('HH-mm-ss'));
    //alert(new Date().getTime());
    //alert(moment("1387481862", "X").format('YYYY-MM-DD'));
    
    //alert(moment('2001-01-01 00:00:00').startOf('day').format('X'));
    
    
    //var testNum = 1.3457888904
    //alert(testNum.toFixed(5));
    
    
    
    
    //$("#user_logged_status").css("background-color","red");
    //$("#user_logged_status").html("tst");
    
    
	
	//alert((21.899999618530273).toPrecision(13));
	
	//var curDateTime = new Date();
    //var curTime = moment(curDateTime).format('HH:mm:ss');
	//alert(curTime);
	
	
    
    
    
    
	
	
	
	
	
	
	
	
	
      var dbName = "jqm-todo";
      var dbVersion = 1;
      var todoDB = {};
      var indexedDB = window.indexedDB;

      todoDB.indexedDB = {};
      todoDB.indexedDB.db = null;
	


      todoDB.indexedDB.onerror = function(e) {
        console.log(e);
      };

      todoDB.indexedDB.open = function() {
        var request = indexedDB.open(dbName, dbVersion);

        request.onsuccess = function(e) {
          console.log ("success our DB: " + dbName + " is open and ready for work");
          todoDB.indexedDB.db = e.target.result;
          //todoDB.indexedDB.getAllTodoItems();
        }
        
        request.onupgradeneeded = function(e) {
          todoDB.indexedDB.db = e.target.result;
          var db = todoDB.indexedDB.db;
          console.log ("Going to upgrade our DB from version: "+ e.oldVersion + " to " + e.newVersion);

            try {
              if (db.objectStoreNames && db.objectStoreNames.contains("todo")) {
                db.deleteObjectStore("todo");
              }
            }
            catch (err) {
              console.log("got err in objectStoreNames:" + err);
            }
            var store = db.createObjectStore("todo",
                {keyPath: "timeStamp"});
            console.log("-- onupgradeneeded store:"+ JSON.stringify(store));
          }
       
        request.onfailure = function(e) {
          console.error("could not open our DB! Err:"+e);  
        }
        
        request.onerror = function(e) {
          console.error("Well... How should I put it? We have some issues with our DB! Err:"+e);
        }
      };

      todoDB.indexedDB.addTodo = function(todoText) {
        var db = todoDB.indexedDB.db;
        var trans = todoDB.indexedDB.db.transaction("todo", "readwrite");
        var store = trans.objectStore("todo");

        var data = {
          "text": todoText,
          "timeStamp": new Date().getTime()
        };

        var request = store.put(data);

        request.onsuccess = function(e) {
			alert('e');
          //todoDB.indexedDB.getAllTodoItems();
        };

        request.onerror = function(e) {
          console.error("Error Adding an item: ", e);
        };
      };

      todoDB.indexedDB.getAllTodoItems = function() {
        var todos = document.getElementById("todoItems");
        todos.innerHTML = "";

        var db = todoDB.indexedDB.db;
        var trans = db.transaction("todo", "readonly");
        var store = trans.objectStore("todo");

        // Get everything in the store;
        var keyRange = IDBKeyRange.lowerBound(0);
        var cursorRequest = store.openCursor(keyRange);

        cursorRequest.onsuccess = function(e) {
          var result = e.target.result;
          if(!!result == false)
            return;

          alert(result.value);
          result.continue();
        };

        cursorRequest.onerror = todoDB.indexedDB.onerror;
      };
	
	
	
	  todoDB.indexedDB.showTodoItem = function() {
        var db = todoDB.indexedDB.db;
        var trans = db.transaction("todo", "readonly");
        var store = trans.objectStore("todo");

        // Get everything in the store;
        var keyRange = IDBKeyRange.lowerBound(0);
        var cursorRequest = store.openCursor(keyRange);

        cursorRequest.onsuccess = function(e) {
          var result = e.target.result;
          if(!!result == false)
            return;

          alert(getRecordProperties(result.value));
          result.continue();
        };

        cursorRequest.onerror = todoDB.indexedDB.onerror;
      };
	
	
		todoDB.indexedDB.open();
	
	    //setTimeout(function () {
		//	todoDB.indexedDB.addTodo("Tst");
		//}, 3000);
	
	
		//setTimeout(function () {
		//	todoDB.indexedDB.showTodoItem();
		//}, 3000);
	
	alert('y');
	if ("Notification" in window){
		alert("Defined!");
	} else {
		alert("Undefined!");
	}
	
	//Display system-level notification
	setNotification('Timebox is finished!', 'You can void it, accept it, or accept and immediately start a new one.');
	
	

		
	  	
	


    
    
    
    
    
    
    
    
    
    
    
    //Switch app to fullscreen mode
    //var docElm = document.documentElement;
    //if (docElm.requestFullscreen) {
    //    docElm.requestFullscreen();
    //} else if (docElm.mozRequestFullScreen) {
    //    docElm.mozRequestFullScreen();
    //} else if (docElm.webkitRequestFullScreen) {
    //    docElm.webkitRequestFullScreen();
    //}
    
    
    


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
        //alert('online');
    } else {
        //alert('offline');
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