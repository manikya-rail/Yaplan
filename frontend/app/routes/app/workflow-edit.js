import Ember from 'ember';

export default Ember.Route.extend({
  model(transition) {
    return Ember.RSVP.hash({
      documents: this.store.findAll('document'),
      projectWorkflow: this.store.queryRecord('project-workflow', {
        project_id: transition.params['app.projects.projecttab'].id
      }),
    });
  },
  actions: {
    reloadPage() {
      this.refresh();
    }
  }
});
