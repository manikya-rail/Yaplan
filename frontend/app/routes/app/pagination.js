import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend({
	perPage: 5,

	model(params) {
		return this.store.query('project', params)
	},

});



	
