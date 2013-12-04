//Open IS Login app's page
$(document).on("click", ".button_login", function() {
	//We should fill Domain name and login textboxes with values we entered during previous login attempts
	$('#page_login_domain').val(window.localStorage.getItem("backendDomain"));
	$('#page_login_name').val(window.localStorage.getItem("userLogin"));
	
})



//Button Login in IS was pressed
$(document).on('click','.page_login_submit',function(){
	
	var backendDomain = $.trim($('#page_login_domain').val());
	if (!backendDomain) { alert('Please enter backend domain.'); return false; }
    var userLogin = $.trim($('#page_login_name').val());
    if (!userLogin) { alert('Please enter your user name.'); return false; }
    var userPass = $.trim($('#page_login_pass').val());
    if (!userPass) { alert('Please enter your password.'); return false; }
    
    //We should store Domain name and login textboxes values to use them later
	window.localStorage.setItem("backendDomain", backendDomain);
	window.localStorage.setItem("userLogin", userLogin);
    
	backendLogin(backendDomain, userLogin, userPass);
})



//Button Log out of IS was pressed
$(document).on('click','.button_logout',function(){
	backendDomain = window.localStorage.getItem("backendDomain");
	if (!backendDomain) { backendDomain = "http://ren.renat.biz" }
	backendLogout(backendDomain);
});



//Log in IS
var backendLogin = function(backendDomain, userLogin, userPass) {

    //Get Drupal Services token
    var servicesToken = getServicesToken(backendDomain);
    //We should store Drupal Services token value to avoid querying it for each put, delete or post request (that would double responce time) - NOT IMPLEMENTED YET
    window.localStorage.setItem("servicesToken", servicesToken);

	$.ajax({
        url: backendDomain + "/rest/user/login.json",
        type: 'post',
        data: 'username=' + encodeURIComponent(userLogin) + '&password=' + encodeURIComponent(userPass),
        dataType: 'json',
        //dataType: 'jsonp',
        beforeSend: function (request) {
            request.setRequestHeader("X-CSRF-Token", servicesToken);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert('page_login_submit - failed to login');
            console.log(JSON.stringify(XMLHttpRequest));
            console.log(JSON.stringify(textStatus));
            console.log(JSON.stringify(errorThrown));
        },
        success: function (data) {
            //Modify localStorage value to show the fact we're now logged in
        	window.localStorage.setItem("userLogged", "loggedIn");
        	//Show user we're now logged in
        	loggedInIndicator();
        	//Switch to app's front page
        	$.mobile.changePage("index.html", "slideup");
        }
    });
    return false;
}



//Log out of IS
var backendLogout = function(backendDomain) {

    //Get Drupal Services token
    var servicesToken = getServicesToken(backendDomain);

    try {
        $.ajax({
            url: backendDomain + "/rest/user/logout.json",
            type: 'post',
            dataType: 'json',
            beforeSend: function (request) {
                request.setRequestHeader("X-CSRF-Token", servicesToken);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('button_logout - failed to logout');
                console.log(JSON.stringify(XMLHttpRequest));
                console.log(JSON.stringify(textStatus));
                console.log(JSON.stringify(errorThrown));
            },
            success: function (data) {
                alert("You have been logged out.");
                //Modify localStorage value to show the fact we're now logged out
            	window.localStorage.setItem("userLogged", "loggedOut");
            	//Show user we're now logged out
            	loggedInIndicator();
                //Unset backendDomain variable since we're logged out
            	delete window.backendDomain;
            }
        });
    }
    catch (error) { alert("button_logout - " + error); }
    return false;
}
