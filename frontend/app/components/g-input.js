import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'input',

  attributeBindings: ['placeholder', 'value'],

  debounceTime: 150,

  value : null,

  /**
   * Handles when user types in INPUT
   */
  keyUp(){
    Ember.run.debounce(this, this.handleChanging, this.debounceTime);
  },

  /**
   * Handles when value is changed
   */
  change(){
    this.handleChanging();
  },

  /**
   * Handles paste event on input
   */
  paste(){
    Ember.run.later(this, this.handleChanging, 0);
  },

  /**
   * If there is changes in text - sets value to component object and send onChanging action
   */
  handleChanging(){
    var newValue = this.element.value;

    if(this.value != newValue){
      this.set('value', newValue);
      this.sendAction('onChanging', newValue);
    }
  }
});
