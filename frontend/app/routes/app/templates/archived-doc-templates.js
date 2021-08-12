import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return Ember.RSVP.hash({
      documentTemplates: this.store.query('document-template', {
        archived: true
      }),
    });
  },
  actions: {
    refreshPage() {
      this.refresh();
    }
  }
});
