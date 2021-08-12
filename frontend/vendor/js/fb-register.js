$.fn.triggerRegisterFB = function(){
	console.log("FB event trigger");
	
	fbq('track', 'CompleteRegistration');
}