$.fn.initSentry = function(email, id){
	Raven.setUserContext({
	    email: email,
	    id: id
	});
}