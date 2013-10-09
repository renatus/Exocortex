var timeoutTimebox;

$(document).on('click','.button_timebox_start',function(){
    //1500
    var durationPlanned = 1 * 1000;
    timeoutTimebox = window.setTimeout(timeboxEnded, durationPlanned);
});

function timeboxEnded(){
    //alert("End");
    //Show app Global menu
    $("#timebox_ended_popup").popup("open");
}

function timeboxVoided(){
    window.clearTimeout(timeoutTimebox);
}