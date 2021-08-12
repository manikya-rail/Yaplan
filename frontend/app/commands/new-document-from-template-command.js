import Ember from 'ember';

let inject = Ember.inject;

export default Ember.Object.extend({
  name: 'documents:new-from-template',
  documents: inject.service(),
  // @TODO: bad
  _routing: inject.service('-routing'),

  /**
   * Creates new document and redirects to document editor
   */
  execute(template, project){
    this.get('documents').createFromTemplate(template, project).then(doc =>{

      // @TODO: really bad thing here. review how to do this through route (problems with sendAction, commandRegistry)
      // this.get('_routing').transitionTo('app.dashboard.editor', [doc]);
      this.get('_routing').transitionTo('app.documents.editor', [doc]);
    });
  }
})
