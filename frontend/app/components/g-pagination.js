import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		callNext: function(pgNumber) {
			this.sendAction('callNext', pgNumber);
		},

		prevPage: function() {
			this.sendAction('prevPage');
		},

		nextPage: function() {
			this.sendAction('nextPage');
		}
	}
});
