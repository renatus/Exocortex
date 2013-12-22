//This code will only work if script is plugged iside subpage DIV, and only for that page
//And those subpages, that are placed higher in index.html code, than subpage-scriptplugger
//Hence this script is placed in special file, that is imported at bottommost unused subpage



//If some JQM page was shown
//"pageshow" is deprecated since JQM 1.4, should be replaced by "pagecontainershow", but latter don't work for now
$("div").on("pageshow", function(event, ui){
    //Reload list of Activities titles if we're on Activities list page for specified period of time (i.e. for today, or for future)
    alert('s');
    //reload_activities_list();
});