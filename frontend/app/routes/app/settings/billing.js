import Ember from 'ember';
import $ from 'jquery';

export default Ember.Route.extend({
	store: Ember.inject.service(),
	billings: Ember.inject.service(),

	model(){
		return Ember.RSVP.hash({
	      plans: this.store.findAll('plan'),
	      subscription: this.get('billings').getCurrentSubscription()
	    });
	}
});