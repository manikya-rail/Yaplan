import Ember from 'ember';

export default Ember.Component.extend({
  didReceiveAttrs() {
    if (this.$('#rejection-reason'))
      this.$('#rejection-reason').val('');
  },
  actions: {
    rejectTask() {
      this.sendAction('rejectTask', this.get('task'), this.$('#rejection-reason').val());
    }
  }
});
