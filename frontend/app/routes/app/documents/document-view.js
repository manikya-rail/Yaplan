import Ember from 'ember';
import $ from 'jquery';

export default Ember.Route.extend({
  /**
   * Returns model associated with this route
   */
  beforeModel() {
    NProgress.start();
  },
  afterModel(model) {
    NProgress.done();
  },
  model(params) {
    return Ember.RSVP.hash({
      versions: Ember.$.get(`/v1/documents/${params.id}/versions`),
      document: this.store.queryRecord('document', { id: params.id , view: true }),
      categories: Object.entries(this.store.queryRecord('category', { reload: true })),
    })
  },
  actions : {
    /**
     * When user clicks project - transition to the page with documents related to project
     * @param project
     */
    onProjectClick(project_id){
      // this.transitionTo('app.dashboard.documents', project_id);
      // this.transitionTo('app.projects.projecttab', project_id);
      this.transitionTo('app.projects.projecttab.collaborator', project_id);
    },

    back(){
      // this.transitionTo('app.dashboard.editor', this.currentModel.document);
         this.transitionTo('app.documents.editor', this.currentModel.document);
    }
  }
});
