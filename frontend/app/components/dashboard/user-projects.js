import Ember from 'ember';

export default Ember.Component.extend({
  router: Ember.inject.service('-routing'),
  sortProps: ['createdAt:desc'],
  sortedProjects: Ember.computed.sort('userProjects', 'sortProps'),
  actions: {
    navigateToProject(projectId) {
      this.get('router').transitionTo('app.projects.projecttab.collaborator', projectId);
      // this.get('router').transitionTo('app.projects.projecttab.collaborator', projectId);
    }
  }
});
