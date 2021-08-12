import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    assignTo() {
      const assigneeId = this.$('#assignee').val();
      const approverId = this.$('#approver').val();
      this.sendAction('assignTo', assigneeId, approverId)
    }
  }
});
