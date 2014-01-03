//onLoad function will be executed once all content (including images, HTML, JS and CSS files, etc.) is completely loaded
function onLoad() {
        
    //If we're connected to the internet
    //navigator.onLine will always return True at desktop Linux, and at Chrome for Android
    if (navigator.onLine) {
        //Put new active activities from backend to app DB
        get_new_activities_from_backend();
    }



    //We should initialize jQuery Mobile panel, if it is located outside of page, or it will be treated as page
    //If you'll use $('#panel_global_menu').panel(); without .enhanceWithin(), panel conten will not be enhanced by jQuery Mobile
    //You can call jQuery Mobile functions for each widget individually, if that widget is located outsude of regular subpage
    $('#panel_global_menu').panel().enhanceWithin();
    
    
    
    //Count all modified app's DB entries, unsynced to server, and show the result
    unsynced_db_entries_count();
}



//Create TaffyDB for unique IDs for TaffyDB tables entries
//To obtain IDs with autoincrement values, we have to store latest used ID value here on per-table basis
//We can't get it from appropriate table, as latest row may be removed, and one ID will be used two times
var tablesIDsTDB = TAFFY([]);
//Storing DB records in localStorage
//Newly-added information syncs automatically to localStorage
//DB syncs automatically from localStorage during app loading
tablesIDsTDB.store("tablesIDsTDB"); 



// Create TaffyDB for IS Activities
var activitiesTDB = TAFFY([]);
//Storing DB records in localStorage
//Newly-added information syncs automatically to localStorage
//DB syncs automatically from localStorage during app loading
activitiesTDB.store("activitiesTDB"); 



// Create TaffyDB for IS checkins
var checkinsTDB = TAFFY([]);
//Storing DB records in localStorage
//Newly-added information syncs automatically to localStorage
//DB syncs automatically from localStorage during app loading
checkinsTDB.store("checkinsTDB"); 



// Create TaffyDB for IS Timeboxes
var timeboxesTDB = TAFFY([]);
//Storing DB records in localStorage
//Newly-added information syncs automatically to localStorage
timeboxesTDB.store("timeboxesTDB"); 



//Get a new ID for a new app DB entry
//IDs are unique per DB table
//They can be only reused in case all DB was cleared - including all entries
function getNewTDBEntryID(TDBTableName) {
    //Get last ID used in the given table
    var tableEntry = tablesIDsTDB({TDBTableName:TDBTableName}).first();

	if(tableEntry){
		//If IDs for that table were already used
		tableID = parseInt(tableEntry.tableID) + 1;
	}else{
		//If IDs weren't used for that table (i.e. we're going to insert first entry)
		//ID 0 is reserved for special cases
		tableID = 1;
	}
	
	//Store newly-generated ID at app DB
	//.merge() will add entry or replace it (if already exist)
    //we should provide id column name to find existing entries, or "id" column will be used
    tablesIDsTDB.merge({"TDBTableName":TDBTableName, 
                        "tableID":tableID}, "TDBTableName");
	
	return tableID;
}



//If we're logged in, set global variable with IS domain
if (window.localStorage.getItem("userLogged") == "loggedIn") {
    //Don't forget to change backendDomain when you log in or log out
    //backendDomain variable should be global
	var backendDomain = window.localStorage.getItem("backendDomain");
}



//Set default Planned timebox duration, in seconds
var timeboxDurationPlannedDefault = 15;
//In the future it would be possible to modify Planned timebox duration, so timeboxDurationPlanned will be altered
var timeboxDurationPlanned = timeboxDurationPlannedDefault;
    
    
    
//Clear all app's cache, if appropriate button was pressed
$(document).on('click','.page_login_clear_cache',function() {
	window.localStorage.clear();
	alert("Cache cleared!")
})



//Command to sync all new and modified entries from app DB TO backend
$(document).on('click','.button_sync_to_backend',function(){
    sync_modified_activities();
	sync_modified_checkins();
    sync_modified_timeboxes();
});



//Command to sync all new and modified entries to app DB FROM backend
$(document).on('click','.button_sync_from_backend',function(){
    //Put new active activities from backend to app DB
    get_new_activities_from_backend();
});



//Command to switch to Fullscreen mode on all clicks
//We should switch to fullscreen only if fullscreen mode is not suspended at app's settings
//$(document).on('click',function(){
//    switchToFullScreen();
//});



//Switch to fullscreen mode, if app is not yet in it
//It's impossible to force full-screen onLoad, only after some click event
var switchToFullScreen = function() {
    //If app is not in fullscreen mode yet
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } 
}



//Show whether we're logged in IS or not
//If you'll reload indicator page, i.e. with {reloadPage:true}, all JavaScript alterations will vanish
var loggedInIndicator = function() {
	if (window.localStorage.getItem("userLogged") == "loggedIn") {
        $("#user_logged_status").css("background-color","green");
	} else {
		$("#user_logged_status").css("background-color","red");
	}
}



//Get Drupal Services token (security measure implemented by this module)
//To put jQuery AJAX request in a separate function, make it synchronous: async:false,
//You should return a value after the call to AJAX, not inside success handler
var getServicesToken = function(backendDomain) {
    var servicesToken;

    try {
        // Obtain session token.
        $.ajax({
            url: backendDomain + "/services/session/token",
            type:"get",
            dataType:"text",
            //dataType:"jsonp",
            async:false,
            error:function (jqXHR, textStatus, errorThrown) {
                //alert('Failed to retrieve backend token');
                if (errorThrown) {
                    alert(errorThrown);
                }
            },
            success: function (token) {
                servicesToken = token;
            }
        });

        return servicesToken;
    }
    catch (error) { alert("Failed to retrieve backend token - " + error); }
}



//Send JSON data to create or modify backend node
//URLpart should contain last part of the node URL at IS, like this: "/rest/node/123.json"
//dataToSend should be JSON data to modify Drupal node
//fuctionOnSuccess should contain function name (in specific format) to call after this function execution will be completed
function edit_backend_node(entryID, URLpart, requestType, dataToSend, functionOnSuccess, msgOnSuccess, msgOnError) {
    //We have to get Services token for security
    //We can think about it's caching - now we have to make two requests instead of one for node modification
    var servicesToken = getServicesToken(backendDomain);

    console.log("Create/Update backend node from app DB entry " + entryID + ": " + dataToSend);
    //If we would like to see JSON data sent to modify node, uncomment line below
    //alert(dataToSend);

    if(servicesToken) {
        try {
            $.ajax({
                url: backendDomain + URLpart,
                //async: false,
                type: requestType,
                beforeSend: function (request) {
                    request.setRequestHeader("X-CSRF-Token", servicesToken);
                },
                data: dataToSend,
                dataType: 'json',
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert(msgOnError);
                    console.log(JSON.stringify(XMLHttpRequest));
                    console.log(JSON.stringify(textStatus));
                    console.log(JSON.stringify(errorThrown));
                },
                success: function (data) {                    
                    //Call function to complete node-specific tasks, that should be done after node sync
                    window[functionOnSuccess](entryID, msgOnSuccess);
                }
            });
        return false;
        } catch (error) { alert(msgOnError + " " + error); }
    }
};



//Show all modified app's DB entries, unsynced to server; and it's properties values
function unsynced_db_entries_show() {
    var dbEntriesValues = "";
    
    //Iterate through all Activities with filled lastUpdatedLocally DB properties
    activitiesTDB({lastUpdatedLocally:{"!is":""}}).each(function(record,recordnumber) {
		dbEntriesValues = "Unsynced Activities:\n";
		//Get properties and their values of current DB entry
		dbEntriesValues = dbEntriesValues + getRecordProperties(record);
    });
    
    //Iterate through all Checkins with filled lastUpdatedLocally DB properties
    checkinsTDB({lastUpdatedLocally:{"!is":""}}).each(function(record,recordnumber) {
	    dbEntriesValues = dbEntriesValues +"<p></p>Unsynced Checkins:\n";
		//Get properties and their values of current DB entry
		dbEntriesValues = dbEntriesValues + getRecordProperties(record);
    });
    
    //Iterate through all Timeboxes with filled lastUpdatedLocally DB properties
    timeboxesTDB({lastUpdatedLocally:{"!is":""}}).each(function(record,recordnumber) {
	    dbEntriesValues = dbEntriesValues +"<p></p>Unsynced Timeboxes:\n";
		//Get properties and their values of current DB entry
		dbEntriesValues = dbEntriesValues + getRecordProperties(record);
    });
    
    //If there are unsynced entries
    if(dbEntriesValues) {
		alert(dbEntriesValues);
    } else {
		alert("There are no unsynced entries!");
	}
}

//Button Show unsynced was pressed
$(document).on('click','.button_show_unsynced',function(){
	unsynced_db_entries_show();
});

//Show all app's DB entries IDs
function db_entries_show() {
    var dbEntriesIDs = "";
    
    //Iterate through all Activities
	dbEntriesIDs = "Activities:\n";
    activitiesTDB({}).each(function(record,recordnumber) {
		dbEntriesIDs = dbEntriesIDs + "<span class='activityID' id='" + record['id'] + "'>" + record['id'] + " </span>";
    });
    
    //Iterate through all Checkins
	dbEntriesIDs = dbEntriesIDs +"<p></p>Checkins:\n";
    checkinsTDB({}).each(function(record,recordnumber) {
		dbEntriesIDs = dbEntriesIDs + "<span class='checkinID' id='" + record['id'] + "'>" + record['id'] + " </span>";
    });
    
    //Iterate through all Timeboxes
	dbEntriesIDs = dbEntriesIDs +"<p></p>Timeboxes:\n";
    timeboxesTDB({}).each(function(record,recordnumber) {
	    dbEntriesIDs = dbEntriesIDs + "<span class='checkinID' id='" + record['id'] + "'>" + record['id'] + " </span>";
    });
    
    //If there are DB entries
    if(dbEntriesIDs) {
		$("#db_entries_list").html(dbEntriesIDs);
    } else {
		$("#db_entries_list").html("There are no DB entries!");
	}
}

//Button Show DB entries was pressed
$(document).on('click','.button_show_db_entries',function(){
	db_entries_show();
});

$(document).on('click','.checkinID',function(){
	var entryID = $(this).attr('id');
	//Get Checkin entry from JS DB
    var dbEntry = checkinsTDB({id:entryID}).first();
	alert(entryID + ' ' + dbEntry);
	alert(getRecordProperties(dbEntry));
});

//Return list of all properties and it's values of received object
function getRecordProperties(record){
	var recordPropertiesList = "";
	//Iterate through all properties
	for(i in record){
		recordPropertiesList = recordPropertiesList + i + ": " + record[i] + "\n";
	}
	return recordPropertiesList;
}



//Count all modified app's DB entries, unsynced to server, and show the result
function unsynced_db_entries_count() {
    var unsyncedDbEntriesNum = 0;
    
    //Iterate through all Activities with filled lastUpdatedLocally DB properties
    activitiesTDB({lastUpdatedLocally:{"!is":""}}).each(function(record,recordnumber) {
	    unsyncedDbEntriesNum = unsyncedDbEntriesNum + 1;
    });
    
    //Iterate through all Checkins with filled lastUpdatedLocally DB properties
    checkinsTDB({lastUpdatedLocally:{"!is":""}}).each(function(record,recordnumber) {
	    unsyncedDbEntriesNum = unsyncedDbEntriesNum + 1;
    });
    
    //Iterate through all Timeboxes with filled lastUpdatedLocally DB properties
    timeboxesTDB({lastUpdatedLocally:{"!is":""}}).each(function(record,recordnumber) {
	    unsyncedDbEntriesNum = unsyncedDbEntriesNum + 1;
    });
    
    //Show number of all modified app's DB entries, unsynced to server (for example, 4)
    $(".db_entries_unsynced").html(unsyncedDbEntriesNum);
    //If there are unsynced entries
    if(unsyncedDbEntriesNum > 0) {
        //Let's modify indicator background color
        $(".db_entries_unsynced").css("background-color","red");
    } else {
        //Let's modify indicator background color
        $(".db_entries_unsynced").css("background-color","gray");
    }
}

//If we clicked on JQM subpages footer Unsynced to server DB entries indicator
$(document).on('click','.db_entries_unsynced',function(){
    alert("Number of DB entries, unsynced to server");
});