import Ember from 'ember';

export default Ember.Route.extend({
  /**
   * Defines query parameters
   */
  // queryParams: {
  //   sortby: {
  //     refreshModel: true,
  //     replace: true
  //   },

  //   keyword: {
  //     refreshModel: true,
  //     replace: true
  //   }
  // },
  // withWorkflow: true,
  // /**
  //  * Returns model associated with this route
  //  */
  // model(params) {
  //   return Ember.RSVP.hash({
  //     projects: this.store.query('project', { keyword: params.keyword }),
  //     params: params,
  //     categories: this.store.findAll('Category'),
  //     workflowTemplates: this.store.findAll('WorkflowTemplate'),
  //   })
  // },

  // isaddcategorymodal: true,

  // actions: {
  //   changeKeyword: updatequery('keyword'),
  //   changeSortBy: updatequery('sortby', v => v ? v.id : undefined),

  //   /**
  //    * When user clicks project - transition to the project menu page
  //    * @param project
  //    */
  //   onProjectClick(project) {
  //     // this.transitionTo('app.dashboard.documents', project.id);
  //     this.transitionTo('app.dashboard.projecttab', project.id);
  //     this.transitionTo('app.dashboard.projecttab.collaborator', project.id);
  //   },

  //   /**
  //    * Handles when new project was created
  //    */
  //   onProjectCreated() {
  //     this.refresh();
  //   },

  //   addProject(withWorkflow) {
  //     this.set('withWorkflow', (withWorkflow || false));
  //     this.set('isAddProjectOpened', true);
  //   },

  //   createproject(titles, category_id, workflow_template_id) {
  //     let store = this.get('store');
  //     let newproject = store.createRecord('project');
  //     newproject.setProperties({
  //       title: titles,
  //       category_id: category_id,
  //       workflow_template_id: workflow_template_id
  //     });
  //     newproject.save().then(function(saveddata) {
  //       projectid = saveddata.get('id');
  //     });
  //   },

  //   createcategory() {
  //     this.set('isaddcategorymodal', true);
  //   },

  //   createnewcategory(ctegoryname, categoryimagedata) {},

  //   invitelistofmemeber(collaborators) {
  //     collaborators.project_id = projectid;

  //     let invitationss = {};
  //     invitationss.collaborators = [];
  //     invitationss.collaborators = collaborators.collaborators;
  //     invitationss.message = collaborators.message;
  //     invitationss.project_id = projectid;


  //     var store = this.get('store');
  //     var projectinvitation = store.createRecord('invitations');
  //     projectinvitation.setProperties({
  //       message: invitationss.message,
  //       project_id: invitationss.project_id,
  //       collaborators: invitationss.collaborators

  //     });
  //     projectinvitation.save().then(function(saveddata) {

  //       console.log(saveddata);

  //     });
  //   }
  // }
});

