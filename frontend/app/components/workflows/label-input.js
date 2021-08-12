import Ember from 'ember';
export default Ember.Component.extend({
  actions: {
    updateLabel(skipped) {
      if (skipped) {
        this.sendAction('updateLabel', this.get('labelToEdit'));
      } else {
        const label = this.$('#workflow-label').val();
        const decision = this.$('#workflow-decision').val();
        this.sendAction('updateLabel', label, decision);
      }
    },
  }
});
