//React on button pressure
//There can be more than one button (at different places) for loading of a same page
//These buttons loads Activities lists (scheduled for today, tomorrow, future etc) 
//Show activities planned for today
//$(document).on('click','.button_activities_main',function(){
function show_activities_today(){
    //Get current Date and Time
    var curDateTime = new Date();
    //Months numbers counts from 0, not from 1
    var curDayStart = curDateTime.getFullYear() + '-' + ("0" + (curDateTime.getMonth()+1)).slice(-2) + '-' + ("0" + curDateTime.getDate()).slice(-2) + " 00:00:00";
    var plannedStartTimestamp = Date.parse(curDayStart);
    var curDayEnd = curDateTime.getFullYear() + '-' + ("0" + (curDateTime.getMonth()+1)).slice(-2) + '-' + ("0" + curDateTime.getDate()).slice(-2) + " 23:59:59";
    var plannedEndTimestamp = Date.parse(curDayEnd);
    
    //Show activities with plannned end date between beginning and ending of current day
    show_activities_list("#page_activities_today_list", plannedStartTimestamp, plannedEndTimestamp);
}

//Show activities planned for tomorrow
//$(document).on('click','.button_activities_tomorrow',function(){
function show_activities_tomorrow(){
    //Get current Date and Time
    var curDateTime = new Date();
    //add a day to the date
    curDateTime.setDate(curDateTime.getDate() + 1);
    //Months numbers counts from 0, not from 1
    var tomorrowDayStart = curDateTime.getFullYear() + '-' + ("0" + (curDateTime.getMonth()+1)).slice(-2) + '-' + ("0" + curDateTime.getDate()).slice(-2) + " 00:00:00";
    var plannedStartTimestamp = Date.parse(tomorrowDayStart);
    var tomorrowDayEnd = curDateTime.getFullYear() + '-' + ("0" + (curDateTime.getMonth()+1)).slice(-2) + '-' + ("0" + curDateTime.getDate()).slice(-2) + " 23:59:59";
    var plannedEndTimestamp = Date.parse(tomorrowDayEnd);
    
    show_activities_list("#page_activities_tomorrow_list", plannedStartTimestamp, plannedEndTimestamp);
}

//Show activities planned for future except tomorrow
//$(document).on('click','.button_activities_future',function(){
function show_activities_future(){
    //Get current Date and Time
    var curDateTime = new Date();
    //add a two days to the date
    curDateTime.setDate(curDateTime.getDate() + 2);
    //Months numbers counts from 0, not from 1
    var futureDayStart = curDateTime.getFullYear() + '-' + ("0" + (curDateTime.getMonth()+1)).slice(-2) + '-' + ("0" + curDateTime.getDate()).slice(-2) + " 00:00:00";
    var plannedStartTimestamp = Date.parse(futureDayStart);
    //Future has no "end", we can choose any day not too near to current
    var futureDayEnd = "2025-12-31 23:59:59";
    var plannedEndTimestamp = Date.parse(futureDayEnd);
    
    show_activities_list("#page_activities_future_list", plannedStartTimestamp, plannedEndTimestamp);
}



//$(document).on('click','.button_activities_past',function(){               
//Show outdated activities
function show_activities_outdated(){
    //Get current Date and Time
    var curDateTime = new Date();
    //add a two days to the date
    curDateTime.setDate(curDateTime.getDate() - 1);
    //Past has no "start", we can choose any day not too near to current
    var pastDayStart = "2010-01-01 00:00:00";
    var plannedStartTimestamp = Date.parse(pastDayStart);
    //Months numbers counts from 0, not from 1
    var pastDayEnd = curDateTime.getFullYear() + '-' + ("0" + (curDateTime.getMonth()+1)).slice(-2) + '-' + ("0" + curDateTime.getDate()).slice(-2) + " 23:59:59";
    var plannedEndTimestamp = Date.parse(pastDayEnd);
    
    show_activities_list("#page_activities_past_list", plannedStartTimestamp, plannedEndTimestamp);
}

$(document).on('click','.button_activities_low-prio',function(){
    //get_node_list("/json/activities/low-prio", "#page_activities_low-prio_list");
});

$(document).on('click','.button_activities_high-prio',function(){
    //get_node_list("/json/activities/high-prio", "#page_activities_high-prio_list");
});

$(document).on('click','.button_activities_completed',function(){
    //get_node_list("/json/activities/completed", "#page_activities_completed_list");
});

$(document).on('click','.button_activities_postponed',function(){
    //get_node_list("/json/activities/postponed", "#page_activities_postponed_list");
});

$(document).on('click','.button_activities_waiting',function(){
    //get_node_list("/json/activities/waiting", "#page_activities_waiting_list");
});



//We should get all activities only in case there were no updates for a long time
//We have a page with all activities, created or updated today and yesterday
//So in case last update wasn't earlier than yestersay, we should use this page
function get_new_activities_from_backend(){
    
    //Get timestamp for the beginnig of yesterday
    //Get current Date and Time
    var curDateTime = new Date();
    //add a day to the date
    curDateTime.setDate(curDateTime.getDate() - 1);
    //Months numbers counts from 0, not from 1
    var yesterDayStart = curDateTime.getFullYear() + '-' + ("0" + (curDateTime.getMonth()+1)).slice(-2) + '-' + ("0" + curDateTime.getDate()).slice(-2) + " 00:00:00";
    var yesterDayStartTimestamp = Date.parse(yesterDayStart);
    
    //Get timestamp from LocalStorage to find out, when we've synced activities from the server the last time
    var lastSyncTimestamp = parseInt(window.localStorage.getItem("activitiesLastUpdatedFromServer"));
    
    if(lastSyncTimestamp > yesterDayStartTimestamp){
        //We've synced today or yesterday
        //Put from backend to app DB only those active activities, that was created and updated today or yesterday
        get_activities_from_backend("/json/activities/updated-today-yesterday");
    } else {
        //We've NOT synced today or yesterday
        //Put all active activities from backend to app DB
        get_activities_from_backend("/json/activities/active");
    }
}



//Get list of nodes (with all properties) from IS and put that list to app's DB
//URLpart should contain last part of the list URL at IS, like this: "/json/activities/waiting"
function get_activities_from_backend(URLpart){
    
    //Get current timestamp
    curDateTime = new Date();
    curTimestamp = Date.parse(curDateTime);
    
    try {
        $.ajax({
            url: backendDomain + URLpart,
            type: 'get',
            dataType: 'json',
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Failed to get new activities from backend.');
                console.log(JSON.stringify(XMLHttpRequest));
                console.log(JSON.stringify(textStatus));
                console.log(JSON.stringify(errorThrown));
            },
            success: function (data) {
                //Put imported activities to app DB, one by one
                $.each(data.nodes,function (node_index,node_value) {
                    console.log(JSON.stringify(node_value));
                    
                    //We have only update those nodes that wasn't modifiet locally
                    //Or modifications will be lost
                    //Get current Activity entry from JS DB
                    var curActivityEntry = activitiesTDB({nid:node_value.node.nid}).first();
					
					if(!(curActivityEntry)) {
						//If we don't have an activity entry with this NID at app DB
						//Create new entry with just ID and NID columns
						//We can't add ID at main .merge, as it will override ID for existing entries
                        //.merge() will add entry or replace it (if already exist)
                        //we should provide id column name to find existing entries, or "id" column will be used
                        activitiesTDB.merge({"id":getNewTDBEntryID("activitiesTDB"),
											 "nid":node_value.node.nid}, "nid");
					}
    
                    if(!(curActivityEntry.lastUpdatedLocally)) {
                        //Fill Activity entry at TaffyDB
                        //.merge() will add entry or replace it (if already exist)
                        //we should provide id column name to find existing entries, or "id" column will be used
                        activitiesTDB.merge({"nid":node_value.node.nid, 
                                             "title":node_value.node.title, 
                                             "status":node_value.node.status, 
                                             "statusRAW":node_value.node.statusRAW, 
                                             "priority":node_value.node.priority, 
                                             "priorityRAW":node_value.node.priorityRAW, 
                                             "strategicImportance":node_value.node.strategicImportance, 
                                             "strategicImportanceRAW":node_value.node.strategicImportanceRAW, 
                                             "difficultyPlanned":node_value.node.difficultyPlanned, 
                                             "difficultyPlannedRAW":node_value.node.difficultyPlannedRAW,
                                             "difficulty":node_value.node.difficulty, 
                                             "difficultyRAW":node_value.node.difficultyRAW,
                                             "group":node_value.node.group, 
                                             "groupRAW":node_value.node.groupRAW, 
                                             "dateTimePlannedStartTimestamp":Date.parse(node_value.node.dateTimePlannedStart),
                                             "datePlannedStart":dateTimeSplit(node_value.node.dateTimePlannedStart, "date"), 
                                             "timePlannedStart":dateTimeSplit(node_value.node.dateTimePlannedStart, "time"), 
                                             "dateTimePlannedEndTimestamp":Date.parse(node_value.node.dateTimePlannedEnd),
                                             "datePlannedEnd":dateTimeSplit(node_value.node.dateTimePlannedEnd, "date"), 
                                             "timePlannedEnd":dateTimeSplit(node_value.node.dateTimePlannedEnd, "time"),
                                             "dateTimePlannedTZ":TZSplit(node_value.node.dateTimePlannedTZ), 
                                             "dateTimePlannedOffset":TZSplit(node_value.node.dateTimePlannedOffset), 
                                             "dateTimeStartTimestamp":Date.parse(node_value.node.dateTimeStart), 
                                             "dateStart":dateTimeSplit(node_value.node.dateTimeStart, "date"), 
                                             "timeStart":dateTimeSplit(node_value.node.dateTimeStart, "time"), 
                                             "dateTimeEndTimestamp":Date.parse(node_value.node.dateTimeEnd), 
                                             "dateEnd":dateTimeSplit(node_value.node.dateTimeEnd, "date"), 
                                             "timeEnd":dateTimeSplit(node_value.node.dateTimeEnd, "time"),
                                             "dateTimeTZ":TZSplit(node_value.node.dateTimeTZ), 
                                             "dateTimeOffset":TZSplit(node_value.node.dateTimeOffset), 
                                             "lastUpdated":node_value.node.lastUpdated, 
                                             "lastUpdatedLocally":"", 
                                             "bodySummary":node_value.node.bodySummary}, "nid");
                                             
                        //We should delete end date in case it is the same as start date - Drupal returns same date when there is no end date at all
                        if(node_value.node.dateTimeStart == node_value.node.dateTimeEnd) {
                            //.merge() will add entry or replace it (if already exist)
                            //we should provide id column name to find existing entries, or "id" column will be used
                            activitiesTDB.merge({"nid":node_value.node.nid, 
                                                 "dateTimeEndTimestamp":"", 
                                                 "dateEnd":"", 
                                                 "timeEnd":""}, "nid");
                        }					
                    }
                });    
                
                //Save current timestamp to LocalStorage to be able to know, when we've synced activities from the server the last time
                window.localStorage.setItem("activitiesLastUpdatedFromServer",curTimestamp); 
                
                // Vibrate for 2 seconds
                //window.navigator.vibrate is prefixed at Chrome 31, works at Firefox
                window.navigator.vibrate(2000);
                alert("App database updated from backend!");
            }
        });
    }
    catch (error) { alert("Failed to get new activities from backend - " + error); }
};



//Show list of activities titles for a specified period of time (i.e. for today, or future)
//UlHtmlElementId should contain HTML list element ID - we'll put list of activities titles there
function show_activities_list(UlHtmlElementId, plannedStartTimestamp, plannedEndTimestamp) {
    //put list of items to loading app's HTML page, one by one
    
    //.html("") prevents old page elements from popping up after returning to the page after visiting other pages
    //Not a replacement for listview("destroy")
    $(UlHtmlElementId).html("");
    
    //Function to filter out appropriate activities from TaffyDB
    activitiesTDB(function(){if(this.dateTimePlannedEndTimestamp >= plannedStartTimestamp && this.dateTimePlannedEndTimestamp <= plannedEndTimestamp && this.statusRAW != "completed" && this.statusRAW != "postponed" && this.statusRAW != "canceled"){return true;}}).each(function(record,recordnumber) {
    
        //Choose activity entry icon based on it's strategic importance
        //TaffyDB stores numbers as strings, you have to use == rather than ===
        if(record["strategicImportanceRAW"] == 2000){
            //If strategic importance is normal
            var dataIcon = "star";
        } else if(record["strategicImportanceRAW"] == 3000){
            //If strategic importance is major
            var dataIcon = "alert";
        } else {
            //If strategic importance is low
            //We'll set data-icon to 'false' to prevent demonstration of default arrow-r icon
            var dataIcon = "false";
        }
        
        //Choose activity entry background color based on it's priority
        //TaffyDB stores numbers as strings, you have to use == rather than ===
        if(record["priorityRAW"] <= 1000){
            //If priority is low or lowest
            var dataTheme = "a";
        } else if(record["priorityRAW"] == 3000){
            //If priority is major
            var dataTheme = "b";
        } else if(record["priorityRAW"] == 4000){
            //If priority is critical
            var dataTheme = "b";
        } else {
            //If priority is normal
            var dataTheme = "a";
        }
        
        
        //Add <li> list item element to DOM
	    //$(UlHtmlElementId).append($('<li></li>',{"html":"<a href='#page_node_activity_view' id='" + record["nid"] + "' class='page_node_pages_list_title'>" + record["title"] + "</a>"}));
	    $(UlHtmlElementId).append("<li data-icon='" + dataIcon + "' data-theme='" + dataTheme + "'><a href='#page_node_activity_view' id='" + record["id"] + "' class='page_node_pages_list_title'>" + record["title"] + "</a></li>");
    });
    
    //We should destroy listview to show only added list items
    //Refreshing list also will reveal new items, but old will stay there as well
    $(UlHtmlElementId).listview("destroy").listview(); 
};



//Return unmodified, but splitted Date or Time
function dateTimeSplit(dateTime, toReturn){
    //Date field raw value is like this: "2013-05-29 01:22:55"
    //Via Services module Date field returns time in UTC timezone, not in timezone time was saved. Via Views it'll return values in timezone we saved that values.
    //Services responce: [{"value":"2013-07-04 16:00:48","value2":"2013-07-09 16:00:10","timezone":"Europe/Moscow","offset":"14400","offset2":"14400","timezone_db":"UTC","date_type":"datetime"}]
    if(!dateTime){
        //If there are no Date and time (i.e. we haven't planned start and end date yet)
        return "";
    }
    
    dateTimeSplitted=dateTime.split(" ");
    
    if (toReturn === "date") {
        //Return Date
        return dateTimeSplitted[0];
    } else {
        //Return Time
        return dateTimeSplitted[1];
    }
}   
    
    

//Not used for now - but may be adjusted for timezone correction

//Return timezone-adjusted Date or Time
function dateTimeConvert(dateTime, TZOffsetRAW, toReturn){
    //Date field raw value is like this: "2013-05-29 01:22:55"
    //Via Services module Date field returns time in UTC timezone, not in timezone time was saved. Via Views it'll return values in timezone we saved that values.
    //Services responce: [{"value":"2013-07-04 16:00:48","value2":"2013-07-09 16:00:10","timezone":"Europe/Moscow","offset":"14400","offset2":"14400","timezone_db":"UTC","date_type":"datetime"}]

    if(!dateTime){
        //If there are no Date and time (i.e. we haven't planned start and end date yet)
        return "";
    }
    
    //Parse Date string and create Date object with that string's value, and DON'T apply timezone offset to it
    //Timezone offset should be applied like this: TZSplit(TZOffsetRAW)*1000
    //Timezone offset is stored in seconds at Drupal, JS works with milliseconds
    dateTimeObject = new Date(Date.parse(dateTime) + TZSplit(TZOffsetRAW)*1000);
    
    if (toReturn === "date") {
        //Return timezone-adjusted date
        dateValue = dateTimeObject.getFullYear() + '-' + 
                    //Months numbers counts from 0, not from 1
                    ("0" + (dateTimeObject.getMonth() + 1)).slice(-2) + '-' + 
                    ("0" + dateTimeObject.getDate()).slice(-2);
        return dateValue;
    } else {
        //Return timezone-adjusted time
        timeValue = ("0" + dateTimeObject.getHours()).slice(-2) + ':' +
                    ("0" + dateTimeObject.getMinutes()).slice(-2) + ':' +
                    ("0" + dateTimeObject.getSeconds()).slice(-2);
        return timeValue;
    }
}



//Timezone name and offset are duplicated by backend: "Europe/Moscow Europe/Moscow", "14400 14400"
//We should split string and return just first part of it
function TZSplit(TZRAW){
    doubleTZ=TZRAW.split(" ");
    return doubleTZ[0];
}



//Each Activity node title is rendered as button
//If we've pressed Activity title, we should draw activity HTML page
$(document).on('click','a.page_node_pages_list_title',function(){
    //Get Drupal node ID from app's page HTML attribute - don't forget to convert it in number
    entryID = parseInt($(this).attr('id'));
	render_activity("#page_node_activity_view", ".content", entryID);
});



//Show single IS activity node
//HTMLpageID should contain ID of app's page, where we'll insert retrieved data
//All activities are drawn at the same empty app's page
//ContentHtmlElementClass should contain CSS class of element we'll insert data in
//entryID should contain app's DB entry id
function render_activity(HTMLpageID, ContentHtmlElementClass, entryID) {
    //Get current Activity entry from JS DB
    var curActivityEntry = activitiesTDB({id:entryID}).first();
                     
    //Draw Activity HTML page at app, with machine-readable data- attributes
    //Set Page title
    $(HTMLpageID + " h1").html(curActivityEntry.title);  
    //Set activity Planned from to                       
    $(HTMLpageID + " #page_activity_planned_date").html("<p>Planned from: " + curActivityEntry.datePlannedStart + " " + curActivityEntry.timePlannedStart + 
                                                                    " to: " + curActivityEntry.datePlannedEnd + " " + curActivityEntry.timePlannedEnd + "</p>");
    //Set activity from to
    $(HTMLpageID + " #page_activity_start_date").html("<p>From: " + curActivityEntry.dateStart + " " + curActivityEntry.timeStart + 
                                                          " to: " + curActivityEntry.dateEnd + " " + curActivityEntry.timeEnd + "</p>");
    //Set custom property with app DB entry ID
    $(HTMLpageID).attr("data-entryID", entryID);
    //Set activity description text summary
    $(HTMLpageID + " " + ContentHtmlElementClass).html(curActivityEntry.bodySummary);
}



//Set Activity completion start date at app's DB, and, if possible, in IS
$(document).on('click','.button_start_date',function(){
    entryID = parseInt($("#page_node_activity_view").attr("data-entryID"));
    
    //Get current Activity entry from JS DB
    var curActivityEntry = activitiesTDB({id:entryID}).first();
    
    //Date, Time and Timezone format examples:
    //var curDate = "2013-05-30";
    //var curTime = "23:00:07";
    //var timeZoneName = "Europe/Moscow";
    
    //Get current Date, Time and Timezone, convert them to Drupal-readable form
    curDateTime = new Date();
    curTimestamp = Date.parse(curDateTime);
    //Months numbers counts from 0, not from 1
    var curDate = curDateTime.getFullYear() + '-' + ("0" + (curDateTime.getMonth()+1)).slice(-2) + '-' + ("0" + curDateTime.getDate()).slice(-2);
    var curTime = ("0" + curDateTime.getHours()).slice(-2) + ':' + ("0" + curDateTime.getMinutes()).slice(-2) + ':' + ("0" + curDateTime.getSeconds()).slice(-2);
    //Determine the time zone of the browser client, jstz.min.js required
    var timeZone = jstz.determine();
    timeZoneName = timeZone.name();
    //.getTimezoneOffset() will return result in minutes, Drupal uses seconds
    timeZoneOffset = curDateTime.getTimezoneOffset()*60;

    //Start date and time are the same as current because we're starting work now
    var startDate = curDate;
    var startTime = curTime;


    //Set modified values at app DB
    //.merge() will add entry or replace it (if already exist)
    //we should provide id column name to find existing entries, or "id" column will be used
    activitiesTDB.merge({"id":entryID,
                         "status":"Active", 
                         "statusRAW":"active", 
                         "dateStart":startDate, 
                         "timeStart":startTime, 
                         "dateTimeStartTimestamp":curTimestamp,
                         //We should handle the case when we used different timezones for start and end dates
                         "dateTimeTZ":timeZoneName, 
                         "dateTimeOffset":timeZoneOffset, 
                         //Mark entry as updated locally
                         "lastUpdatedLocally":Math.round(curDateTime.getTime()/1000)}, "id");
    
    //If we're connected to the internet
    //navigator.onLine will always return True at desktop Linux, and at Chrome for Android
    if (navigator.onLine) {
        //Sync modified data to backend
        activity_sync_to_backend(entryID);
    }

    //Rebuild HTML page to show all changes
    render_activity("#page_node_activity_view", ".content", entryID);
});



//Set Activity completion end date, status and difficulty at app's DB, and, if possible, in IS
$(document).on('click','.button_end_date',function(){
    entryID = parseInt($("#page_node_activity_view").attr("data-entryID"));
    
    //Get current Activity entry from JS DB
    var curActivityEntry = activitiesTDB({id:entryID}).first();
    
    //Date, Time and Timezone format examples:
    //var curDate = "2013-05-30";
    //var curTime = "23:00:07";
    //var timeZoneName = "Europe/Moscow";
    
    //Get current Date, Time and Timezone, convert them to Drupal-readable form
    curDateTime = new Date();
    curTimestamp = Date.parse(curDateTime);
    //Months numbers counts from 0, not from 1
    var curDate = curDateTime.getFullYear() + '-' + ("0" + (curDateTime.getMonth()+1)).slice(-2) + '-' + ("0" + curDateTime.getDate()).slice(-2);
    var curTime = ("0" + curDateTime.getHours()).slice(-2) + ':' + ("0" + curDateTime.getMinutes()).slice(-2) + ':' + ("0" + curDateTime.getSeconds()).slice(-2);
    //Determine the time zone of the browser client, jstz.min.js required
    var timeZone = jstz.determine();
    timeZoneName = timeZone.name();
    //.getTimezoneOffset() will return result in minutes, Drupal uses seconds
    timeZoneOffset = curDateTime.getTimezoneOffset()*60;

    //If we've started activity completion earlier, provide date and time of that start
    if(curActivityEntry.dateStart) {
        var startDate = curActivityEntry.dateStart;
        var startTime = curActivityEntry.timeStart;
        var startTimestamp = curActivityEntry.dateTimeStartTimestamp;
    } else {
        //Else provide current date and time as start date and time
        var startDate = curDate;
        var startTime = curTime;
        var startTimestamp = curTimestamp;
    }
    
    
    //Set modified values at app DB
    //.merge() will add entry or replace it (if already exist)
    //we should provide id column name to find existing entries, or "id" column will be used
    activitiesTDB.merge({"id":entryID,
                         "status":"Completed", 
                         "statusRAW":"completed", 
                         "dateStart":startDate, 
                         "timeStart":startTime, 
                         "dateTimeStartTimestamp":startTimestamp,
                         "dateEnd":curDate, 
                         "timeEnd":curTime,
                         "dateTimeEndTimestamp":curTimestamp,
                         //We should handle the case when we used different timezones for start and end dates
                         "dateTimeTZ":timeZoneName, 
                         "dateTimeOffset":timeZoneOffset, 
                         //TODO: We should check wasn't difficulty and difficultyRAW set yet
                         "difficulty":curActivityEntry.difficultyPlanned, 
                         "difficultyRAW":curActivityEntry.difficultyPlannedRAW,
                         //Mark entry as updated locally
                         "lastUpdatedLocally":Math.round(curDateTime.getTime()/1000)}, "id");
    
    
    //If we're connected to the internet
    //navigator.onLine will always return True at desktop Linux, and at Chrome for Android
    if (navigator.onLine) {
        //Sync modified data to backend
        activity_sync_to_backend(entryID);
    }
    
    //Rebuild HTML page to show all changes
    render_activity("#page_node_activity_view", ".content", entryID);    
});



//Add one day to "Planned to" activity property
$(document).on('click','.button_planned_to_date_plus_one',function(){
    entryID = parseInt($("#page_node_activity_view").attr("data-entryID"));
    change_activity_planned_to_date(entryID, 1);
    
    //Rebuild HTML page to show all changes
    render_activity("#page_node_activity_view", ".content", entryID);
});



//Subtract one day from "Planned to" activity property
$(document).on('click','.button_planned_to_date_minus_one',function(){
    entryID = parseInt($("#page_node_activity_view").attr("data-entryID"));
    change_activity_planned_to_date(entryID, -1);
    
    //Rebuild HTML page to show all changes
    render_activity("#page_node_activity_view", ".content", entryID);
});



//Add specified number (can be negative) of days to "Planned to" activity property
function change_activity_planned_to_date(entryID, numberOfDays) {
    
    //Get Activity entry from JS DB
    var curActivityEntry = activitiesTDB({id:entryID}).first();
    
    //If there is no "Planned to" date, we can't add one day to it
    if(curActivityEntry.dateTimePlannedEndTimestamp) {
    
        //Date, Time and Timezone format examples:
        //var curDate = "2013-05-30";
        //var curTime = "23:00:07";
        //var timeZoneName = "Europe/Moscow";

        curDateTime = new Date();
    
        //Create Date object with old planned end date and time
        var oldPlannedEndDateTime = new Date(parseInt(curActivityEntry.dateTimePlannedEndTimestamp)); 
        //We should populate variable for a NEW date with a Date object, and it should be created from OLD timestamp (in milliseconds)
        var newPlannedEndDateTime = new Date(parseInt(curActivityEntry.dateTimePlannedEndTimestamp));
        newPlannedEndDateTime.setDate(oldPlannedEndDateTime.getDate() + numberOfDays);
        var plannedEndDate = newPlannedEndDateTime.getFullYear() + '-' + ("0" + (newPlannedEndDateTime.getMonth()+1)).slice(-2) + '-' + ("0" + newPlannedEndDateTime.getDate()).slice(-2);
        var plannedEndTime = curActivityEntry.timePlannedEnd;
        var plannedEndTimestamp = Date.parse(plannedEndDate + " " + plannedEndTime);
        
        //Planned end date can't be earlier, than planned start date
        //We can reduce planned start date as well, but this is not always desirable
        if(plannedEndTimestamp >= curActivityEntry.dateTimePlannedStartTimestamp){
        
            //Set modified values at app DB
            //.merge() will add entry or replace it (if already exist)
            //we should provide id column name to find existing entries, or "id" column will be used
            activitiesTDB.merge({"id":entryID,
                                 "datePlannedEnd":plannedEndDate, 
                                 "timePlannedEnd":plannedEndTime,
                                 "dateTimePlannedEndTimestamp":plannedEndTimestamp,
                                 //Looks like we should not bother about timezone here
                                 //Mark entry as updated locally
                                 "lastUpdatedLocally":Math.round(curDateTime.getTime()/1000)}, "id");
    
            //If we're connected to the internet
            //navigator.onLine will always return True at desktop Linux, and at Chrome for Android
            if (navigator.onLine) {
                //Sync modified data to backend
                activity_sync_to_backend(entryID);
            } 
        } else {
            alert("Planned end date can't be earlier, than planned start date");
        }
    }    
}



//Sync all new and modified activities one by one
//Each new and modified activity is marked by modification timestamp at lastUpdatedLocally column
function sync_modified_activities() {
    activitiesTDB({lastUpdatedLocally:{"!is":""}}).each(function(record,recordnumber) {
	    activity_sync_to_backend(record["id"]);
    });
}



//Sync modified activity to IS backend
function activity_sync_to_backend(entryID) {

    //Example of data to send to IS to modify Drupal node:
    //'node[type]=activity&node[language]=en&node[title]=' + encodeURIComponent(title) +
    //'node[field_datetime][und][0][value][date]=' + curDate +
    //'&node[field_datetime][und][0][value][time]=' + curTime;
    
    
    //Get Activity entry from JS DB
    var curActivityEntry = activitiesTDB({id:entryID}).first();
	var nodeID = curActivityEntry.nid;

    //We have to send Date and time Planned start values even if they weren't modified, or they'll diminish after node update
    if(curActivityEntry.datePlannedStart) {
        var fieldDateTimePlannedData = '&node[field_datetime_planned][und][0][value][date]=' + curActivityEntry.datePlannedStart +
                                       '&node[field_datetime_planned][und][0][value][time]=' + curActivityEntry.timePlannedStart;
    } else {
        var fieldDateTimePlannedData = '';
    }
    
    //We have to send Date and time Planned end values even if they weren't modified, or they'll diminish after node update
    //We should send end date and time only in case there are also start date and time
    if(curActivityEntry.datePlannedEnd && curActivityEntry.datePlannedStart) {
        //End date can't be earlier, than start date
        if(!(curActivityEntry.dateTimePlannedEndTimestamp < curActivityEntry.dateTimePlannedStartTimestamp)) {
            var fieldDateTimePlannedData = fieldDateTimePlannedData + '&node[field_datetime_planned][und][0][value2][date]=' + curActivityEntry.datePlannedEnd +
                                                                      '&node[field_datetime_planned][und][0][value2][time]=' + curActivityEntry.timePlannedEnd +
                                //Without [show_todate] argument Drupal Date will not save end date in case you don't have end date at DB yet - but it should be provided only in case there are end date
                                                                      '&node[field_datetime_planned][und][0][show_todate]=1';
        } else {
            alert("Planned start date (" + curActivityEntry.dateTimePlannedStartTimestamp + ") was grater, than end date (" + curActivityEntry.dateTimePlannedEndTimestamp + ") at node " + nodeID + " Planned end date wasn't saved");
        }
    }
    
    //We have to send Date and time Start values even if they weren't modified, or they'll diminish after node update
    if(curActivityEntry.dateStart){
        var fieldDateTimeData = '&node[field_datetime][und][0][value][date]=' + curActivityEntry.dateStart +
                                '&node[field_datetime][und][0][value][time]=' + curActivityEntry.timeStart +
                                '&node[field_datetime][und][0][timezone][timezone]=' + curActivityEntry.dateTimeTZ
    } else {
        var fieldDateTimeData = '';
    }
    
    //We have to send Date and time End values even if they weren't modified, or they'll diminish after node update
    //We should send end date and time only in case there are also start date and time
    if(curActivityEntry.dateEnd && curActivityEntry.dateStart){
        //End date can't be earlier, than start date
        if(!(curActivityEntry.dateTimeEndTimestamp < curActivityEntry.dateTimeStartTimestamp)) {
            var fieldDateTimeData = fieldDateTimeData + '&node[field_datetime][und][0][value2][date]=' + curActivityEntry.dateEnd +
                                                        '&node[field_datetime][und][0][value2][time]=' + curActivityEntry.timeEnd +
                                //Without [show_todate] argument Drupal Date will not save end date in case you don't have end date at DB yet - but it should be provided only in case there are end date
                                                        '&node[field_datetime][und][0][show_todate]=1';
        } else {
            alert("Start date (" + curActivityEntry.dateTimeStartTimestamp + ") was grater, than end date (" + curActivityEntry.dateTimeEndTimestamp + ") at node " + nodeID + " End date wasn't saved");
        }
    }
    
    //Send activity difficulty
    if(curActivityEntry.difficultyRAW){
        var fieldDifficultyData = '&node[field_difficulty][und][' + curActivityEntry.difficultyRAW + ']=' + curActivityEntry.difficultyRAW;
    } else {
        var fieldDifficultyData = '';
    }


    //Put all data to send to IS to modify Drupal node at this variable
    //In case Drupal Date field already has both start and end values stored, you have to send both value and value2
    var dataToSend = 'node[field_difficulty_planned][und][' + curActivityEntry.difficultyPlannedRAW + ']=' + curActivityEntry.difficultyPlannedRAW +
                     fieldDateTimeData +                                       
                     fieldDateTimePlannedData +
                     fieldDifficultyData +
                     '&node[field_task_status][und][' + curActivityEntry.statusRAW + ']=' + curActivityEntry.statusRAW;
                                          
    var URLpart = "/rest/node/" + encodeURIComponent(nodeID) + ".json"
    var requestType = 'put';
    //name of function to complete activity-specific tasks, that should be done after node sync
    var fuctionOnSuccess = "activity_sync_to_backend_success";
	var msgOnSuccess = "Node updated!";
    var msgOnError = "Failed to update activity node at backend!";
	
    //Try to edit backend node
	edit_backend_node(entryID, URLpart, requestType, dataToSend, fuctionOnSuccess, msgOnSuccess, msgOnError);
}

//If activity was updated at backend, we should delete lastUpdatedLocally value at app's DB
//We have to declare function that way to make it possible to call it by name from variable
var funcName = "activity_sync_to_backend_success";
window[funcName]=function(entryID, msgOnSuccess) {
    activitiesTDB.merge({"id":entryID, "lastUpdatedLocally":""}, "id");
	alert(msgOnSuccess);
}