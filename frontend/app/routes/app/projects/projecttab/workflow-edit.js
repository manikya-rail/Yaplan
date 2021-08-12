import Ember from 'ember';

export default Ember.Route.extend({
  model(params, transition) {
    return Ember.RSVP.hash({
      documents: this.store.query('document', {}),
      project: this.store.findRecord(
        'project', transition.params['app.projects.projecttab'].id
      ),
      projectWorkflow: this.store.queryRecord('project-workflow', {
        project_id: transition.params['app.projects.projecttab'].id
      }),
    });
  }
});
