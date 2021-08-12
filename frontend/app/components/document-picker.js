import Ember from 'ember';
import bubble from '../utils/bubble'
export default Ember.Component.extend({
  actions: {
    selectDocument: bubble('selectDocument'),
    toggleDocumentPicker() {
      this.sendAction('toggleDocumentPicker');
    }
  }
});
