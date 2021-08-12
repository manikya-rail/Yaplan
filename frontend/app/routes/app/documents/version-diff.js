import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return Ember.RSVP.hash({
      document: this.store.queryRecord('document', { id: params.id }),
      versionNumber: params.version_id,
      version: Ember.$.getJSON(
        `v1/documents/${params.id}/track_changes?version_number=${params.version_id}`
      ),
    })
  }
});
