import Ember from 'ember';

export default Ember.Component.extend({
	message: '',

	visiblityObserver: Ember.observer('active', function(){
		this.set('message', '');
	}),

	actions: {
		confirm: function(){
			this.sendAction('onRequestApproval', this.get('message'));
			this.set('active', false);
		}
	}
});