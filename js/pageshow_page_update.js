//This code will only work if script is plugged iside subpage DIV, and only for that page
//And those subpages, that are placed higher in index.html code, than subpage-scriptplugger
//Hence this script is placed in special file, that is imported at bottommost unused subpage

//$("div").on("pageshow", function(event, ui){
//    var webPageType = $(':mobile-pagecontainer').pagecontainer("getActivePage").attr("data-pagetype");
//    if(webPageType == "page_activities") {
//        var curPageID = $(':mobile-pagecontainer').pagecontainer("getActivePage").attr("id");
//        var funcName = "fill_" + curPageID;
//        window[funcName]();
//    }
    
    
    //alert($(this).attr('id'));
    //if($(this).attr('id') == "page_activities_today"){
    //    show_activities_today();
    //} else if($(this).attr('id') == "page_activities_tomorrow"){
    //    show_activities_tomorrow();
    //} else if($(this).attr('id') == "page_activities_future"){
    //    show_activities_future();
    //} else if($(this).attr('id') == "page_activities_past"){
    //    show_activities_past();
    //} else if($(this).attr('id') == "page_activities_yesterday"){
    //    show_activities_yesterday();
    //}
//});



$(":mobile-pagecontainer").on("pagecontainershow", function(event, ui) {
  alert($(":mobile-pagecontainer").pagecontainer("getActivePage").attr("id"));
});