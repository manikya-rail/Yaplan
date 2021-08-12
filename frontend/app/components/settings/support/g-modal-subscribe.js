import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		confirm: function(){
			this.sendAction('onConfirm', this.get('plan'));
		},
		change: function(){
			this.sendAction('onChange');
		}
	}
});