import Ember from 'ember';

export default Ember.Route.extend({
	reset_token: '',
	model(){
		return {token: this.get('reset_token')}
	},
	beforeModel: function(transition){
		this.set('reset_token', transition.queryParams.reset_password_token);
	},
	actions: {
		gotoLogin: function(){
			this.transitionTo('reg.login');
		}
	}
});