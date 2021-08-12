import Ember from 'ember';
import SelectBox from '../../mixins/selectbox';
import bubble from '../../../utils/bubble';

export default Ember.Component.extend(SelectBox, {
  classNames: ['choose-project', 'g-choose-project', 'button-toggle-type0', '-after-mar5'],
  classNameBindings: ['on:on:off'],

  on: false,

  /**
   * Handles click on the button
   */
  click(){
    this.set('on', !this.get('on'));
  }
});
