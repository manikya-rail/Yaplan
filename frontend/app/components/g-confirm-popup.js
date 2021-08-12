import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    proceed() {
      this.toggleProperty('active');
      this.sendAction('proceed');
    },
  },
});
