import Ember from 'ember';

export default Ember.Route.extend({

  store: Ember.inject.service(),

  model(params, transition) {
    return Ember.RSVP.hash({
      documents: this.store.query('document', {
        project_id: transition.params['app.projects.projecttab'].id,
        reload: true,
        page: 1
      }),
      projectID: transition.params['app.projects.projecttab'].id,
    });
  },

  actions: {
    refreshPage(){
      this.refresh();
    }
  }

});
