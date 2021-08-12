import Ember from 'ember';

export default Ember.Component.extend({
	defaultActivated : false,
	defaultUrl : '',

	setupDefaultUrl: function(){
		this.set('defaultUrl', 'assets/images/profile/default.png');
	}.on('init'),

	
	actions : {
		activateDefault: function(){
			let defaultActivated = this.get('defaultActivated');
			let defaultUrl = this.get('defaultUrl');

			if (!defaultActivated){
				this.set('src', defaultUrl);
				this.set('defaultActivated', true);
			}else{
				//If default also fails : block onerror event for good
				this.set('src', '');
			}
		}
	}
});