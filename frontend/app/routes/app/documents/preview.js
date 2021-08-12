import Ember from 'ember';
import $ from 'jquery';

export default Ember.Route.extend({
  /**
   * Returns model associated with this route
   */
  beforeModel() {
    NProgress.start();
  },
  afterModel() {
    NProgress.done();
  },
  model(params){
    return Ember.RSVP.hash({
      document: this.store.find('document', params.id),
    });
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
