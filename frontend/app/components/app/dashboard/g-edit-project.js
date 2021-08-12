import Ember from 'ember';
import bubble from '../../../utils/bubble';

export default Ember.Component.extend({
  classNames: ['edit-project', 'button-toggle-type0', '-after-mar5'],
  classNameBindings: ['on:on:off'],

  on: false,

  /**
   * Handles click on the button
   */
  click(){
    this.set('on', !this.get('on'));
  },

  actions : {
    onEditProjectName : bubble('onEditProjectName'),
    onChangeApprover: bubble('onChangeApprover'), 
    onDeleteProject: bubble('onDeleteProject'),
    onArchiveProject: bubble('onArchiveProject')
  }

});
