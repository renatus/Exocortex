//Variable to delay Timebox-related JS code execution
var timeoutTimebox;

//Button [Start] Timebox was clicked
$(document).on('click','.button_timebox_start',function(){
    //timeboxDurationPlanned (in seconds) is set at main.js
    timeboxStarted(timeboxDurationPlanned);
});



//New Timebox was started
//durationPlanned is a Timebox planned duration, in seconds
function timeboxStarted(durationPlanned){
    //Start countdown
    timeoutTimebox = window.setTimeout(timeboxEnded, durationPlanned*1000);
    
    //Date, Time and Timezone format examples:
    //var curDate = "2013-05-30";
    //var curTime = "23:00:07";
    //var timeZoneName = "Europe/Moscow";
	
    //Get current Date, Time and Timezone, convert them to Drupal-readable form
	//Usually timestamp is at seconds, and JavaScript works with milliseconds
    curDateTime = new Date();
    curTimestamp = Date.parse(curDateTime);
	//Months numbers counts from 0, not from 1
    //Firefox will return NaN for Date.parse("2013-12-07 00:00:00"). All browsers will accept Date.parse("2013/12/07 00:00:00")
	var curDate = curDateTime.getFullYear() + '/' + ("0" + (curDateTime.getMonth()+1)).slice(-2) + '/' + ("0" + curDateTime.getDate()).slice(-2);
    var curTime = ("0" + curDateTime.getHours()).slice(-2) + ':' + ("0" + curDateTime.getMinutes()).slice(-2) + ':' + ("0" + curDateTime.getSeconds()).slice(-2);
	//Determine the time zone of the browser client, jstz.min.js required
    var timeZone = jstz.determine();
    timeZoneName = timeZone.name();
	//.getTimezoneOffset() will return result in minutes, Drupal uses seconds
    timeZoneOffset = curDateTime.getTimezoneOffset()*60;
    
	//Get new ID for new entry at timeboxesTDB table
	var entryID = getNewTDBEntryID("timeboxesTDB");
    //Save ID at LocalStorage to retrieve this entry, when timebox will come to it's end
    window.localStorage.setItem("timeboxesTDBEntryID",entryID); 

    //Set values at app DB
    //.merge() will add entry or replace it (if already exist)
    //we should provide id column name to find existing entries, or "id" column will be used
    timeboxesTDB.merge({"id":entryID,
                        "status":"Active", 
                        "statusRAW":"active", 
                        "dateStart":curDate, 
                        "timeStart":curTime,
                        "dateTimeStartTimestamp":curTimestamp,
					    "dateTimeTZ":timeZoneName,
                        "dateTimeOffset":timeZoneOffset,
                        //"duration":"",
                        "durationPlanned":durationPlanned,
					    //Mark entry as updated locally
                        "lastUpdatedLocally":Math.round(curDateTime.getTime()/1000)}, "id");
    
    //For now we can't sync started (but not yet ended) timebox, we have to check, if dateEnd is filled
}



//Timebox come to it's end
function timeboxEnded(){
    //$.mobile.changePage("#timebox_ended", {role:"dialog"});
    
    //Beep once
    navigator.notification.beep(1);
    
    //Ask user, what to do with ended timebox
    navigator.notification.confirm(
        'You can void it, accept it, or accept and immediately start a new one.',  // message
        onTimeboxUserReaction,                                                     // callback to invoke with index of button pressed
        'Timebox is finished',                                                     // title
        'New,OK,Void'                                                              // buttonLabels
    );
}



//User pressed one of the buttons after timebox ended
//Button index is just a single number of a pressed button
function onTimeboxUserReaction(buttonIndex) {
    //Get App DB Entry ID to work with and clear LocalStorage key
    var timeboxesTDBEntryID = parseInt(window.localStorage.getItem("timeboxesTDBEntryID"));
    window.localStorage.removeItem("timeboxesTDBEntryID");
    
    if(buttonIndex == 1){
        //Timebox accepted, new one should be started
        timeboxClosed(timeboxesTDBEntryID, "Completed", "completed");
        //We have to start new timebox after timeboxClosed, because timeoutTimebox variable would be cleared
        //Probably we should clear timeoutTimebox variable only in case timebox was voided (because it can be voided before planned end)
        timeboxStarted(timeboxDurationPlanned);
    } else if(buttonIndex == 2){
        //Timebox accepted
        timeboxClosed(timeboxesTDBEntryID, "Completed", "completed");
    } else {
        //Timebox voided
        timeboxClosed(timeboxesTDBEntryID, "Voided", "voided");
    }
}



//Timebox was closed
//entryID is ID of entry at App DB, status is human-readable status of Timebox node, and statusRAW is machine-readable one
function timeboxClosed(entryID, status, statusRAW){
    
    //Stop timer, as timebox may be voided before it's end
    //Probably we should clear timeoutTimebox variable only in case timebox was voided
    window.clearTimeout(timeoutTimebox);
    
    //Get current Date and Time, convert them to Drupal-readable form
    //Usually timestamp is at seconds, and JavaScript works with milliseconds
    //For now we just don't modify timezone we've set when timebox started
    curDateTime = new Date();
    curTimestamp = Date.parse(curDateTime);
	//Months numbers counts from 0, not from 1
    //Firefox will return NaN for Date.parse("2013-12-07 00:00:00"). All browsers will accept Date.parse("2013/12/07 00:00:00")
	var curDate = curDateTime.getFullYear() + '/' + ("0" + (curDateTime.getMonth()+1)).slice(-2) + '/' + ("0" + curDateTime.getDate()).slice(-2);
    var curTime = ("0" + curDateTime.getHours()).slice(-2) + ':' + ("0" + curDateTime.getMinutes()).slice(-2) + ':' + ("0" + curDateTime.getSeconds()).slice(-2);
    
    //Get Timebox entry from JS DB
    var curTimeboxEntry = timeboxesTDB({id:entryID}).first();
    
    //Timebox duration, seconds
    var duration = (curTimestamp - parseInt(curTimeboxEntry.dateTimeStartTimestamp))/1000;
    
    //Set values at app DB
    //.merge() will add entry or replace it (if already exist)
    //we should provide id column name to find existing entries, or "id" column will be used
    timeboxesTDB.merge({"id":entryID,
                        "status":status, 
                        "statusRAW":statusRAW, 
                        "dateEnd":curDate, 
                        "timeEnd":curTime,
                        "dateTimeEndTimestamp":curTimestamp,
                        "duration":duration,
					    //Mark entry as updated locally
                        "lastUpdatedLocally":Math.round(curDateTime.getTime()/1000)}, "id");
    
    //If we're connected to the internet
    //navigator.onLine will always return True at desktop Linux, and at Chrome for Android
    if (navigator.onLine) {
        //Sync new or modified data to backend
        timebox_sync_to_backend(entryID);
    }
}



//Sync timebox to IS backend
//entryID is ID of entry at App DB
function timebox_sync_to_backend(entryID) {

    //Example of data to send to IS to create or modify Drupal node:
    //'node[type]=activity&node[language]=en&node[title]=' + encodeURIComponent(title) +
    //'node[field_datetime][und][0][value][date]=' + curDate +
    //'&node[field_datetime][und][0][value][time]=' + curTime;
    
    //Get Timebox entry from JS DB
    var curEntry = timeboxesTDB({id:entryID}).first();

    //Put all data to send to IS to modify Drupal node at this variable
    //In case Drupal Date field already has both start and end values stored, you have to send both value and value2
    var dataToSend = 'node[type]=timebox&node[language]=en&node[title]=' + encodeURIComponent("Timebox") +
                     '&node[field_timebox_status][und]=' + curEntry.statusRAW +
                     '&node[field_duration_planned][und][0][value]=' + curEntry.durationPlanned +
                     '&node[field_duration][und][0][value]=' + curEntry.duration +
                     '&node[field_datetime][und][0][value][date]=' + curEntry.dateStart +
                     '&node[field_datetime][und][0][value][time]=' + curEntry.timeStart +
                     '&node[field_datetime][und][0][value2][date]=' + curEntry.dateEnd +
                     '&node[field_datetime][und][0][value2][time]=' + curEntry.timeEnd +
                     '&node[field_datetime][und][0][timezone][timezone]=' + curEntry.dateTimeTZ +
                     //Without [show_todate] argument Drupal Date will not save end date in case you don't have end date at DB yet - but it should be provided only in case there are end date
                     '&node[field_datetime][und][0][show_todate]=1';
                         
    var URLpart = "/rest/node.json";
	var requestType = 'post';
    //name of function to complete activity-specific tasks, that should be done after node sync
    var fuctionOnSuccess = "timebox_sync_to_backend_success";
	var msgOnSuccess = "Node created!";
    var msgOnError = "Failed to create checkin node at backend!";
	
    //Try to edit backend node
    edit_backend_node(entryID, URLpart, requestType, dataToSend, fuctionOnSuccess, msgOnSuccess, msgOnError);
}

//If DB entry was updated at backend, we should delete lastUpdatedLocally value at app's DB
//We have to declare function that way to make it possible to call it by name from variable
//We can use funcName variable everywhere, as we set appropriate value just before each use
var funcName = "timebox_sync_to_backend_success";
window[funcName]=function(entryID, msgOnSuccess) {
    timeboxesTDB.merge({"id":entryID, "lastUpdatedLocally":""}, "id");
}



//Sync to backend all new and modified timeboxes one by one
//Each new and modified timebox is marked by modification timestamp at lastUpdatedLocally column
function sync_modified_timeboxes() {
    timeboxesTDB({lastUpdatedLocally:{"!is":""}}).each(function(record,recordnumber) {
	    timebox_sync_to_backend(record["id"]);
    });
}