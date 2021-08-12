$.fn.trackPageVisit = function(pageName){
	window.analytics.page(pageName);
}
$.fn.trackSubscribe = function(email){
	window.analytics.identify({
		email: email,
		newsletter: true,
	});
	window.analytics.track("Subscribed");
}
$.fn.trackRegister = function(identity, name, email){
	var d = new Date();
    var utc = d.toUTCString();

    var arr_name_parts = name.split(' ');

	window.analytics.identify(identity, {
		firstName: (arr_name_parts.length>1)?arr_name_parts[0]:'Anonymous',
		email: email,
		name: name,
		createdAt: utc
	});
	window.analytics.track("Signup");
}
$.fn.trackLogin = function(identity){
	window.analytics.identify(identity);
	window.analytics.track("Login");
}
	//window.analytics.identify(identity);
	window.analytics.page(pageName);
}