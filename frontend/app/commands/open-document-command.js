import Ember from 'ember';

let inject = Ember.inject;

export default Ember.Object.extend({
  name: 'documents:open',
  // @TODO: bad
  _routing: inject.service('-routing'),

  /**
   * Opens provided document
   */
  execute(doc){
    // @TODO: really bad thing here. review how to do this through route (problems with sendAction, commandRegistry)
    // this.get('_routing').transitionTo('app.dashboard.editor', [doc]);
       this.get('_routing').transitionTo('app.documents.editor', [doc]);
  }
})
