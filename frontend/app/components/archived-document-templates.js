import Ember from 'ember';

export default Ember.Component.extend({
  model(params) {
    return Ember.RSVP.hash({
      archivedDocuments: this.get('store').query(
        'document-template', { archived: true }
      ),
    });
  },
});
