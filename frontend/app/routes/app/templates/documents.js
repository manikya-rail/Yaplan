import Ember from 'ember';

import {DOCUMENT_OPEN} from '../../../services/command-registry';
import $ from 'jquery';

let inject = Ember.inject;

export default Ember.Route.extend({
  commandRegistry: inject.service(),
  onDocumentEdit : false,
  beforeModel() {
    NProgress.start();
  },
  afterModel(model) {
    NProgress.done();
  },
  /**
   * Returns collection of all available templates
   */
  model(){
    return Ember.RSVP.hash({
      documentTemplates: this.store.query('document-template', { reload: true, page: 1 }),
      archivedDocumentCount: $.get('/v1/document_templates/archived_count'),
    })
  },

  actions : {
    clickTemplate(template){
      // this.get('commandRegistry').execute(DOCUMENT_OPEN, template.id);
     this.transitionTo('app.documents.document-view', template.id);
    },

    exportDocument(template){
      this.transitionTo('app.documents.preview', template.id);
    },

    editDocumentName(doc){
      var store = this.get('store');
      this.store.findRecord('document',doc.Document_ID).then(function(template){
        template.set('title',doc.Document_Name);
        template.save();
      });
    },

    refreshPage(){
      this.refresh();
    }
  }
});
