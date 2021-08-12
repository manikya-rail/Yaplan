import Ember from 'ember';

export default Ember.Component.extend({
	router: Ember.inject.service('-routing'),
	actions: {
		viewDocument(id) {
			this.get('router').transitionTo('app.documents.document-view', id);
		}
	}
});
