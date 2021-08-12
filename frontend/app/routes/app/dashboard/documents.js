import Ember from 'ember';
import updatequery from '../../../utils/updatequery';

export default Ember.Route.extend({
  /**
   * Defines query parameters
   */
  queryParams: {
    sortby: {
      refreshModel: true,
      replace: true
    },

    keyword: {
      refreshModel: true,
      replace: true
    }
  },

  /**
   * Returns model related to this route
   */
  model(params){
    return Ember.RSVP.hash({
      documents: this.store.query('document', {project_id: params.id, keyword: params.keyword}),
      project: this.store.find('project', params.id)
    });
  },

  actions : {
    changeKeyword: updatequery('keyword'),
    changeSortBy: updatequery('sortby', v => v ? v.id : undefined),

    /**
     * Handles when user clicks add document
     */
    addDocument(){
      this.transitionTo('app.dashboard.templates', this.currentModel.project.id);
    },
    onDeleteProject(){
      // this.transitionTo('app.dashboard.projects');
      this.transitionTo('app.projects.project');
    }
  }
});
