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
      workflowTemplates: this.store.query(
        'workflow-template', { published: true, page: 1 }
      ),
      categories: this.store.findAll('category'),
    });
  }
});
