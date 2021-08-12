import Ember from 'ember';
import bubble from '../../utils/bubble';

export default Ember.Component.extend({
  classNames: ['document-options', 'button-toggle-type0', '-after-mar5'],
  classNameBindings: ['on:on:off'],

  on: false,

  /**
   * Handles click on the button
   */
  click(){
    this.set('on', !this.get('on'));
  },

 

  actions: {
    onSaveAsTemplate: bubble('onSaveAsTemplate'),
    onDeleteDocument: bubble('onDeleteDocument'),
    onChangeApprover: bubble('onChangeApprover'),
    onIssueForApproval: bubble('onIssueApproval'),
    preview: bubble('preview')
  }
});
