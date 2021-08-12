import Ember from 'ember';

export default Ember.Component.extend({
  projects: Ember.inject.service(),

  


  actions: {
    /**
     * Delete information about project and closes modal dialog
     */
    delete: function(){
      let projects = this.get('projects');
      let project = this.project
      projects.deleteProject(project).then(() => {
          this.set('active', false);
          this.sendAction("onDeleteProject");
      });

    }
  }

});
