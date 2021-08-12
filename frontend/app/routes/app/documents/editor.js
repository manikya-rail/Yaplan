import Ember from 'ember';
// import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import $ from 'jquery';

export default Ember.Route.extend({
  // @TODO: Implement routable component wrapper. As it is imposible to bind to route props

  /**
   * Loads document model
   * @param params
   * @return {*}
   */
  beforeModel() {
    NProgress.start();
  },

  model(params){
    return Ember.RSVP.hash({
      // editDocument: this.store.findRecord('document', params.id),
      editDocument: this.store.queryRecord('document', { id: params.id , editor: true }),
      // comments: this.store.query('comment', {document_id: params.id})
    })
  },

  afterModel(model){
    if(!model){
      this.refresh();
    }
     NProgress.done();
  },


  actions: {
    /**
     * Handles import section
     * TODO: ? make it as command?
     */
    importSection(doc){
      this.transitionTo('app.import-section.choose-doc', doc.id, 'Import');
    },

    /**
     * Handles import section
     * TODO: ? make it as command?
     */
    linkSection(doc){
      this.transitionTo('app.import-section.choose-doc', doc.id, 'Link');
    },

    /**
     * When user clicks project - transition to the page with documents related to project
     * @param project
     */
    onProjectClick(project_id){
      // this.transitionTo('app.dashboard.documents', project_id);
      // this.transitionTo('app.projects.projecttab', project_id);
      this.transitionTo('app.projects.projecttab.collaborator', project_id);
    },

    /**
     * Transition to document preview
     * @param doc
     */
    preview(doc){
      // this.transitionTo('app.dashboard.preview', doc.id);
      this.transitionTo('app.documents.preview', doc.id);
    },

    onDocumentDelete(){
      // this.transitionTo('app.dashboard.projects');
      this.transitionTo('app.projects.project');
    }
  }
});
