import Ember from 'ember';
import bubble from '../../utils/bubble';

export default Ember.Component.extend({
  session: Ember.inject.service(),

  isNotFilled: Ember.computed(
    'documents', 'document_templates',
    function() {
      return (this.get('documents') || (this.get('document_templates')))
    },
  ),

  actions : {
    addDocument: bubble('addDocument'),
    /**
     * Handles wjen user clicks on the document thumbnail
     */
    clickDocument(doc){
      this.sendAction('clickDocument', doc);
    }
  },

  didInsertElement: function() {
  	Ember.run.scheduleOnce('afterRender', this, function() {
  	});  	
  }
});
