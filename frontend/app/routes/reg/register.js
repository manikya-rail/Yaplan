import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		showSuccess : function(email){
			this.transitionTo('reg.success', email);
		}
	}
});
