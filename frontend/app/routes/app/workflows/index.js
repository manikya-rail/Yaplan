import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    NProgress.start();
  },
  afterModel() {
    NProgress.done();
  },
  model() {
    return Ember.RSVP.hash({
      projectWorkflows: this.store.query('project-workflow', { reload: true, page: 1 }),
      categories: this.store.query('category', { reload: true }),
    });
  }
});
