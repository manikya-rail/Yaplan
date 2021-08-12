import Ember from 'ember';

let inject = Ember.inject;

export default Ember.Object.extend({
  name: 'documents:saveas-template',
  // @TODO: bad
  _routing: inject.service('-routing'),

  documents: inject.service(),


  /**
   * Opens provided document
   */
  execute(doc){
    this.get('documents').createTemplate(doc).then(() =>{
      this.get('_routing').transitionTo('app.templates.documents');
    });
  }
})
