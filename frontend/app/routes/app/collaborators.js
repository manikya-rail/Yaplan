import Ember from 'ember';

export default Ember.Route.extend({

  model(){
    return Ember.RSVP.hash({
      dataSource: this.store.findAll('collaborated-document'),
      projects: this.store.findAll('project')
    });
  },

  actions: {
  	onSelectDocument: function(document_id){
  		// this.transitionTo('app.dashboard.editor', document_id);
         this.transitionTo('app.documents.editor', document_id);
  	},
    onReloadResource: function(){
      //this.refresh();
    }
  }
});
