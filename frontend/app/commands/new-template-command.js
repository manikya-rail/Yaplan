import Ember from 'ember';

let inject = Ember.inject;

export default Ember.Object.extend({
  name: 'templates:new',
  documents: inject.service(),
  store: Ember.inject.service(),
  _routing: inject.service('-routing'),

  /**
   * Creates new template and redirects to document editor
   * @param categoryid template document should be related to.
   */
  execute(categoryid){

    let store = this.get('store');
    let self = this;
    let categoryID = categoryid.toString();
    let response = this.get('documents').createBlankTemplate(categoryID);
    self.get('_routing').transitionTo('app.documents.editor', [response.document.id]);
    
  }
})
