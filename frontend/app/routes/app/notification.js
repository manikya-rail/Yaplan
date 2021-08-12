import Ember from 'ember';

export default Ember.Route.extend({

model(params) {
	return Ember.RSVP.hash({
		notifications: this.store.query('activity', { page: 1, reload: true }),
	})
},

});
