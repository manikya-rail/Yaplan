import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      workflowTemplates: this.store.query('workflow-template', { all: true, page: 1 }),
      categories: this.store.findAll('category'),
    });
  }
});
