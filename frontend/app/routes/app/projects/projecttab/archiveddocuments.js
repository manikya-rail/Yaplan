import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    NProgress.start();
  },
  afterModel() {
    NProgress.done();
  },
  model(params, transition) {
    return Ember.RSVP.hash({
      archivedDocuments: this.store.query('document', {
        archived: true, project_id: transition.params['app.projects.projecttab'].id,
      }),
      pid: transition.params['app.projects.projecttab'].id,
    });
  },

  actions: {
    refreshPage(){
      this.refresh();
    }
  }
});