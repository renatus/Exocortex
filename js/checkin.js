//Button Check-in was clicked
//$(document).off().on('click','.button_checkin',function(){
$(document).on('click','.button_checkin',function(){
    //Get current position
    //enableHighAccuracy:true options asks device to provide as precise location as possible
    //Without enableHighAccuracy:true option Android emulatior will not return location at all
    //timeout - time period in milliseconds, after that device will give up trying to find it's position
    //maximumAge - time period in milliseconds, we can use previous mesurements that old
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    //navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy:true, timeout: 120000, maximumAge: 20000});
    
    function onSuccess(position) {
		//Add checkin to app's DB
		checkinAdd(position);
    };
    
    // onError Callback receives a PositionError object
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    };
    
});



//Create Check-in entry at app DB
//position should be geolocation object
function checkinAdd(position) {
	//var title = "Check-in";
	
	//Date, Time and Timezone format examples:
    //var curDate = "2013-05-30";
    //var curTime = "23:00:07";
    //var timeZoneName = "Europe/Moscow";
	
	//Usually timestamp is at seconds, and JavaScript works with milliseconds
	//So we have to multiply timestamp value by 1000, but with position.timestamp we don't have to do that
	//Date and time from GPS can be wrong in Android emulator, that's OK.
	curDateTime = new Date(position.timestamp);
    alert(curDateTime);
	curTimestamp = position.timestamp;
	//Months numbers counts from 0, not from 1
    //Firefox will return NaN for Date.parse("2013-12-07 00:00:00"). All browsers will accept Date.parse("2013/12/07 00:00:00") or ISO 8601 dates
    //Date (and hence Services) module can't handle ISO 8601-formatted dates, but Views module can
    //So for now we'll send such dates as "2013-12-07 00:00:00", and will get such as "1997-07-16T19:20+01:00"
	var curDate = curDateTime.getFullYear() + '-' + ("0" + (curDateTime.getMonth()+1)).slice(-2) + '-' + ("0" + curDateTime.getDate()).slice(-2);
    var curTime = ("0" + curDateTime.getHours()).slice(-2) + ':' + ("0" + curDateTime.getMinutes()).slice(-2);
	//Determine the time zone of the browser client, jstz.min.js required
    var timeZone = jstz.determine();
    timeZoneName = timeZone.name();
	//.getTimezoneOffset() will return result in minutes, Drupal uses seconds
    timeZoneOffset = curDateTime.getTimezoneOffset()*60;
    
    //We should not put inappropriate values, like NULL, at app DB
    //So we can't put geolocation object properties directly to DB, we should check them first
    //NULL and other non-numeric values should be replaced by an empty field
    if($.isNumeric(position.coords.latitude)){
        var coordsLatitude = position.coords.latitude;
    } else {
        var coordsLatitude = "";
    }
    
    if($.isNumeric(position.coords.longitude)){
        var coordsLongitude = position.coords.longitude;
    } else {
        var coordsLongitude = "";
    }
    
    if($.isNumeric(position.coords.accuracy)){
        var coordsAccuracy = position.coords.accuracy;
    } else {
        var coordsAccuracy = "";
    }
        
    if($.isNumeric(position.coords.altitude)){
        var coordsAltitude = position.coords.altitude;
    } else {
        var coordsAltitude = "";
    }
    
    if($.isNumeric(position.coords.altitudeAccuracy)){
        var coordsAltitudeAccuracy = position.coords.altitudeAccuracy;
    } else {
        var coordsAltitudeAccuracy = "";
    }
    
    if($.isNumeric(position.coords.heading)){
        var coordsHeading = position.coords.heading;
    } else {
        var coordsHeading = "";
    }
    
    if($.isNumeric(position.coords.speed)){
        var coordsSpeed = position.coords.speed;
    } else {
        var coordsSpeed = "";
    }
    
	//Get new ID for new entry at checkinsTDB table
	var entryID = getNewTDBEntryID("checkinsTDB");

    //Set values at app DB
    //.merge() will add entry or replace it (if already exist)
    //we should provide id column name to find existing entries, or "id" column will be used
    checkinsTDB.merge({"id":entryID,
                       "date":curDate, 
                       "time":curTime,
                       "dateTimeTimestamp":curTimestamp,
					   "dateTimeTZ":timeZoneName,
                       "dateTimeOffset":timeZoneOffset,
					   //like 55.58175515 Latitude in decimal degrees. (Number)
					   "latitude":coordsLatitude,
					   //like 37.67745413 Longitude in decimal degrees. (Number)
					   "longitude":coordsLongitude,
					   //like 17 Accuracy level of the latitude and longitude coordinates in meters. (Number)
					   "latLonAccuracy":coordsAccuracy,
					   //like 202.3000030517578 Height of the position in meters above the ellipsoid. (Number)
					   "altitude":coordsAltitude,
					   //like null Accuracy level of the altitude coordinate in meters. (Number)
					   "altitudeAccuracy":coordsAltitudeAccuracy,
					   //like 84.80000305175781 Direction of travel, specified in degrees counting clockwise relative to the true north. (Number)
					   "heading":coordsHeading,
					   //like 1 Current ground speed of the device, specified in meters per second. (Number)
					   "speed":coordsSpeed,			   
                       //Looks like we should not bother about timezone here
                       //Mark entry as updated locally
                       "lastUpdatedLocally":Math.round(curDateTime.getTime()/1000)}, "id");
	
	alert("You've checked-in successfully!" +
          'Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
    
    //If we're connected to the internet
    //navigator.onLine will always return True at desktop Linux, and at Chrome for Android
    if (navigator.onLine) {
        //Sync new or modified data to backend
        checkin_sync_to_backend(entryID);
    }
}



//Sync checkin to IS backend
function checkin_sync_to_backend(entryID) {

    //Example of data to send to IS to create or modify Drupal node:
    //'node[type]=activity&node[language]=en&node[title]=' + encodeURIComponent(title) +
    //'node[field_datetime][und][0][value][date]=' + curDate +
    //'&node[field_datetime][und][0][value][time]=' + curTime;
    
    
    //Get Checkin entry from JS DB
    var curEntry = checkinsTDB({id:entryID}).first();

    //Put all data to send to IS to modify Drupal node at this variable
    //In case Drupal Date field already has both start and end values stored, you have to send both value and value2
    //Looks like at least Decimal fields will accept emty values, like this:
    //&node[field_altitude][und][0][value]=&node[field_altitude_accuracy][und][0][value]=
    //So we can not to check whether value is here
    //Attempt to save more digits, than allowed by Drupal Field's Scale setting will give us error
    //We can put more digits, than specified in Scale setting, though, so we've to limit number of all digits in decimal number
    //.toPrecision(13) will round number to 13 digits, it will return string rather than number
    var dataToSend = 'node[type]=check_in&node[language]=en&node[title]=' + encodeURIComponent("Check-in") +
                     '&node[field_place_latlon][und][0][lat]=' + curEntry.latitude +
                     '&node[field_place_latlon][und][0][lon]=' + curEntry.longitude +
                     '&node[field_latlon_accuracy][und][0][value]=' + (curEntry.latLonAccuracy).toPrecision(32) +
                     '&node[field_altitude][und][0][value]=' + (curEntry.altitude).toPrecision(32) +
                     '&node[field_altitude_accuracy][und][0][value]=' + (curEntry.altitudeAccuracy).toPrecision(32) +
                     '&node[field_heading][und][0][value]=' + (curEntry.heading).toPrecision(13) +
                     '&node[field_speed][und][0][value]=' + (curEntry.speed).toPrecision(32) +        
                     '&node[field_datetime_start][und][0][value][date]=' + curEntry.date +
                     '&node[field_datetime_start][und][0][value][time]=' + curEntry.time +
                     '&node[field_datetime_start][und][0][timezone][timezone]=' + curEntry.dateTimeTZ;
    
    var URLpart = "/rest/node.json";
	var requestType = 'post';
    //name of function to complete activity-specific tasks, that should be done after node sync
    var fuctionOnSuccess = "checkin_sync_to_backend_success";
	var msgOnSuccess = "Node created!";
    var msgOnError = "Failed to create checkin node at backend!";
	
    //Try to edit backend node
    edit_backend_node(entryID, URLpart, requestType, dataToSend, fuctionOnSuccess, msgOnSuccess, msgOnError);
}

//If activity was updated at backend, we should delete lastUpdatedLocally value at app's DB
//We have to declare function that way to make it possible to call it by name from variable
//We can use funcName variable everywhere, as we set appropriate value just before each use
var funcName = "checkin_sync_to_backend_success";
window[funcName]=function(entryID, msgOnSuccess) {
    checkinsTDB.merge({"id":entryID, "lastUpdatedLocally":""}, "id");
	//alert(msgOnSuccess);
}



//Sync to backend all new and modified checkins one by one
//Each new and modified checkin is marked by modification timestamp at lastUpdatedLocally column
function sync_modified_checkins() {
    checkinsTDB({lastUpdatedLocally:{"!is":""}}).each(function(record,recordnumber) {
	    checkin_sync_to_backend(record["id"]);
    });
}



//Test geolocation without storing current position
$(document).on('click','.button_geolocation_test',function(){
    //Get current position
    //enableHighAccuracy:true options asks device to provide as precise location as possible
    //Without enableHighAccuracy:true option Android emulatior will not return location at all
    //timeout - time period in milliseconds, after that device will give up trying to find it's position
    //maximumAge - time period in milliseconds, we can use previous mesurements that old
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy:true, timeout: 60000, maximumAge: 20000});
    
    function onSuccess(position) {
        alert("GPS works fine!" +
                'Latitude: '          + position.coords.latitude          + '\n' +
                'Longitude: '         + position.coords.longitude         + '\n' +
                'Altitude: '          + position.coords.altitude          + '\n' +
                'Accuracy: '          + position.coords.accuracy          + '\n' +
                'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                'Heading: '           + position.coords.heading           + '\n' +
                'Speed: '             + position.coords.speed             + '\n' +
                'Timestamp: '         + position.timestamp                + '\n');       
    };

    // onError Callback receives a PositionError object
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    };
    
});