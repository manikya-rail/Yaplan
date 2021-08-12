import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    setApprover(userId) {
      this.sendAction('setApprover', userId);
    }
  }
});
