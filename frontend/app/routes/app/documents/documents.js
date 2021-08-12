import Ember from 'ember';

import {DOCUMENT_OPEN} from '../../../services/command-registry';

let inject = Ember.inject;

export default Ember.Route.extend({

  queryParams: {
    project_id: {
      refreshModel: true,
      replace: true
    },

    sort_by: {
      refreshModel: true,
      replace: true
    },

    keyword: {
      refreshModel: true,
      replace: true
    }
  },

  commandRegistry: inject.service(),
  /**
   * Returns model related to this route
   */
  model(params){
    return Ember.RSVP.hash({
      documents: this.store.query('document', { reload: true, page: 1 }),
      // documents: this.store.query('document', { reload: true }),
      isList: false,
      isTile: true,
      params: params
    });
  },

  actions: {
    /**
     * Handles when user changes project
     */
    changeProject(project){
      this.transitionTo({queryParams: {project_id: project ? project.id : undefined}});
    },

    exportDocument(doc){
      this.transitionTo('app.documents.preview', doc.id);
    },

    refreshPage(){
      this.refresh();
    },

    /**
     * Handles when user changes sort type
     * @param sortBy
     */
    changeSortBy(sortBy){
      this.transitionTo({queryParams: {sort_by: sortBy.id}});
    },

    /**
     * Handles when user changes keyword
     * @param keyword
     */
    changeKeyword(keyword){
      this.transitionTo({queryParams: {keyword: keyword}});
    },

    /**
     * Handles click document action from g-documents component
     * @param doc
     */
    clickDocument(doc){
      this.get('commandRegistry').execute(DOCUMENT_OPEN, doc);
    },

    listAction(){
       this.set('currentModel.isTile', false);
       this.set('currentModel.isList', true);
    },

    tileAction(){
      this.set('currentModel.isTile', true);
      this.set('currentModel.isList', false);
    },

  }
});
