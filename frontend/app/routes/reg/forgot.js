import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		gotoLogin: function(){
			this.transitionTo('reg.login');
		}
	}
});