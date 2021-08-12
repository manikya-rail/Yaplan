import Ember from 'ember';

let inject = Ember.inject;

export default Ember.Object.extend({
  name: 'documents:new',
  documents: inject.service(),
  // @TODO: bad
  _routing: inject.service('-routing'),

  /**
   * Creates new document and redirects to document editor
   * @param project Project document should be related to. Optional
   */
  execute(project){

    this.get('documents').createBlankDocument(project).then(doc =>{

      // @TODO: really bad thing here. review how to do this through route (problems with sendAction, commandRegistry)
      // this.get('_routing').transitionTo('app.dashboard.editor', [doc]);
      this.get('_routing').transitionTo('app.documents.editor', [doc.id]);
    });
  }
})
