import Ember from 'ember';
import bubble from '../utils/bubble';

export default Ember.Component.extend({
  classNames : ['g-search'],

  actions : {
    onChanging : bubble('onChanging')
  }
});
