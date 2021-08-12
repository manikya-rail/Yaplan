import Ember from 'ember';
import * as _ from 'lodash';
const { inject: { service }, Component } = Ember;
export default Ember.Component.extend({
  rejectReasonVisible: false,
	session:     service('session'),
  currentUser: service('current-user'),
  filteredUserTasks: Ember.computed('userTasks.@each.task.state', function() {
    return this.get('userTasks')
  }),
  orderedSteps: Ember.computed('projectWorkflowSteps.@each', function() {
    return this.get('projectWorkflowSteps').filter(step => (
      !_.includes(['startStop'], step.get('nodeType'))
    ));
  }),
  notification: {
    type: 0,
    msg: ''
  },
  actions: {
    changeProject() {
      this.set('selectedProject', this.$('#dashboard-project-filter').val());
    },
    acceptTask(task) {
      const self = this;
      let message;
      switch (task.get('taskType')) {
        case 'assign':
          message = 'Task has been sent for approval';
          break;
        case 'approve':
          message = 'Task has been approved successfully';
          break;
        default:
          message = 'Decision has been made successfully';
      }
      self.sendAction('acceptTask', task, function() {
        self.send('showNotification', message);
      });
    },
    rejectTask(task, reason) {
      const self = this;
      self.sendAction('rejectTask', task, reason, function() {
        self.send('showNotification', 'Task has been rejected successfully');
        self.set('rejectReasonVisible', false);
        self.set('selectedTask', null);
      });
    },
    showRejectReason(task) {
      this.set('rejectReasonVisible', true);
      this.set('selectedTask', task);
    },
    showNotification(message) {
      let self = this;
      self.set('notification.type', 3);
      self.set('notification.msg', message);
      setTimeout(function() {
        self.set('notification.type', 0);
      }, 2000);
    },

  }
});
