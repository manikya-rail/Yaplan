import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    sourceDoc : {}
  },

  model(params){
    return Ember.RSVP.hash({
      sourceDocument: this.store.queryRecord('document', { id: params.sourceDoc }),
      targetDocument: this.store.queryRecord('document', { id: params.id }),
      type : params.type
    });
  },

  actions: {
    /**
     * Handles when import is completed
     */
    afterImport(){
      // this.transitionTo('app.dashboard.editor', this.get('currentModel').targetDocument);
      let doc = this.get('currentModel').targetDocument;
      // console.log(doc);
      let docID = doc.get('id'); 
      // console.log(docID);
      this.transitionTo('app.documents.editor', docID);
    }
  }
});
