import Ember from 'ember';

export default Ember.Component.extend({
  documenttitle : '',

  isNotFilled: Ember.computed('documenttitle', function(){
    let disable = false;
    let doc = this.editDocument;
    return (!this.get('documenttitle'));
  }),

  initFormFields: function(){
    if(this.editDocument !== null) {
      this.set('documenttitle',this.editDocument.get('title'));
    }
  }.on('didReceiveAttrs'),

  actions : {
    UpdateDocument(documentName,id){
      let doc = {
        "Document_ID" : id,
        "Document_Name" : documentName
      }
      this.editDocument.set('title',doc.Document_Name);
      this.sendAction('editDocumentName',doc);
    }
  }
});
