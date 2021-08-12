import Ember from 'ember';
import updatequery from '../../../utils/updatequery';
import {DOCUMENT_NEW, DOCUMENT_NEW_FROM_TEMPLATE} from '../../../services/command-registry';

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

  model(params){
    return Ember.RSVP.hash({
      templates: this.store.findAll('document_template'),
      project: this.store.find('project', params.id)
    });
  },

  commandRegistry: Ember.inject.service(),

  actions: {
    changeKeyword: updatequery('keyword'),

    /**
     * Handles when user clicks create new document from scratch
     */
    createDocument(){
      this.get('commandRegistry').execute(DOCUMENT_NEW, this.currentModel.project);
    },

    /**
     * Handles when user clicks on the template
     * @param template
     */
    createByTemplate(template){
      this.get('commandRegistry').execute(DOCUMENT_NEW_FROM_TEMPLATE, template, this.currentModel.project);
    }
  }
});
