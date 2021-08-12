import Ember from 'ember';

export default Ember.Route.extend({
  model() {
		return Ember.RSVP.hash({
		  archivedDocumentsList: this.store.query('document', { archived: true, reload: true, page: 1 }),
		});
  },

  actions: {
  	refreshPage() {
  		this.refresh();
  	}
  }
});
