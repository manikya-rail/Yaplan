import Ember from 'ember';

export default Ember.Component.extend({
  showEditMode: true,
  didReceiveAttrs() {
    if(this.get('step.state') == 'approved' || this.get('step.state') == 'working' || this.get('step.state') == 'completed') {
      this.set('showEditMode', false);
    } else {
      this.set('showEditMode', true);
    }
    if (this.get('step') && this.get('active')) {
      this.$('input[name="name"]').val(this.get('step.node.data.text'));
    }
  },
  actions: {
    updateStartStop() {
      this.set('step.node.data.text', this.$('input[name="name"]').val());
      this.sendAction(
        'updateStartStop', this.get('step'), this.$('input[name="name"]').val()
      );
    },
    cancelStartStop() {
      this.sendAction('cancelStartStop');
    },
    removeStep() {
      this.sendAction('removeStep', this.get('step'));
    },
  },
});
