import Ember from 'ember';

export default Ember.Component.extend({	
	actions: {
		changeEmail: function(value){
			this.set('email', value);
		}
	}
});