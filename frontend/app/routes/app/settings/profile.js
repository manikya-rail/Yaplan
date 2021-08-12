import Ember from 'ember';


export default Ember.Route.extend({
	model(){

	},
	actions:{
		updateProfile(){
			this.send('updateUserProfile');
		},
	}
});