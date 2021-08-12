import Ember from 'ember';

export default Ember.Component.extend({
  rejectReasonVisible: false,
  selectedTask: null,
  onShowTaskInfo: false,
  notification: {
    type: 0,
    msg: ''
  },
  taskDescActive: false,
  actions: {
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
      this.sendAction('acceptTask', task, function() {
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
    acceptInvite(invite) {
      const self = this;
      this.sendAction('acceptInvite', invite, function(response) {
        let message;
        if (response.error) {
          message = response.error;
        } else {
          message = 'You have accepted the invitation';
        }
        self.send('showNotification', message);
      });
    },
    rejectInvite(invite) {
      const self = this;
      this.sendAction('rejectInvite', invite, function(response) {
        let message;
        if (response.error) {
          message = response.error;
        } else {
          message = 'You have rejected the invitation';
        }
        self.send('showNotification', message);
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
    showDescription(userTask) {
      this.set('selectedUserTask', userTask);
      this.set('taskDescActive', true);
    },
    showTaskInfo(userTask) {
      this.set('selectedUserTask', userTask);
      this.set('onShowTaskInfo', true);
    }
  },
});
