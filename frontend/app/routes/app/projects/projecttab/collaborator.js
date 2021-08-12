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
      project: this.store.peekRecord('project', transition.params['app.projects.projecttab'].id),
      // collaborations: this.store.query('collaboration', {
      //   project_id: transition.params['app.projects.projecttab'].id,
      // }),
      pid: transition.params['app.projects.projecttab'].id,
    });
  },
  show: false,

  actions: {
    reloadCollaborations() {
      this.refresh();
    }
  }
});
