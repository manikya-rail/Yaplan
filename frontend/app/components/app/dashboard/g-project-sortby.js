import Ember from 'ember';
import SelectBox from '../../mixins/selectbox';

export default Ember.Component.extend(SelectBox, {
  classNames: ['project-sortby', 'g-sort-by', 'button-toggle-type0', '-after-mar5'],
  classNameBindings: ['on:on:off'],

  text: 'Sort By',

  on: false
});
