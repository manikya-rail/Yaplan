import Ember from 'ember';

import { DOCUMENT_OPEN } from '../../../services/command-registry';

let inject = Ember.inject;

export default Ember.Route.extend({
  commandRegistry: inject.service(),

  /**
   * Returns collection of all available templates
   */
  model() {
    return Ember.RSVP.hash({
      documentTemplates: this.store.query('document-template', { page: 1 }),
      categories: this.store.findAll('category'),
      isList: false,
      isTile: true,
    });
  },
  actions: {
    clickTemplate(template) {
      // this.get('commandRegistry').execute(DOCUMENT_OPEN, template.id);
      this.transitionTo('app.documents.document-view', template.id);
    },

    listAction(){
       this.set('currentModel.isTile', false);
       this.set('currentModel.isList', true);
    },

    tileAction(){
      this.set('currentModel.isTile', true);
      this.set('currentModel.isList', false);
    },

    refreshPage(){
      this.refresh();
    }
  }
});
