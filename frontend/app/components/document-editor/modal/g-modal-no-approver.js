import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		approve: function(){
			this.sendAction('onApprove');
		},
		selectApprover: function(){
			this.sendAction('onAssign');
		}
	}
});