import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({
  store: Ember.inject.service(),
  PROJECT_URL: '/v1/projects',

  /**
   * Creates new project with given title and tags
   * @param title
   * @param tags
   * @return {*}
     */
  create(title, tags) {
    return this.get('store').createRecord('project', { title: title, tags : tags }).save();
  },

  deleteProject(project){
   return project.destroyRecord();
  },

  archiveProject(project){
    project.set('archived',true);
    return project.save();
  },
  /**
   * Updates existing project with given title and tags
   * @param title
   * @param tags
   * @return {*}
   */
  update(project, title, tags){
    console.log("Console To update");
    project.set('title', title);
    project.set('tags', tags);
    return project.save();
  }
});
