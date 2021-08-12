import Ember from 'ember';
import * as _ from 'lodash';
export default Ember.Component.extend({
  store: Ember.inject.service('store'),
  descriptionCharacterCount: 0,
  showEditMode: true,
  didReceiveAttrs() {
    if(this.get('step.state') == 'approved' || this.get('step.state') == 'working' || this.get('step.state') == 'completed') {
      this.set('showEditMode', false);
    } else {
      this.set('showEditMode', true);
    }
    if (this.get('step') && this.get('active')) {
      this.$('input[name="name"]').val(this.get('step.node.data.text'));
      this.$('textarea[name="description"]').val(this.get('step.description'));
      this.send('checkCharacter');
    }
  },
  didRender() {
    if (this.get('step.task') && this.get('step.task').belongsTo('assignedTo') && this.get('step.task').belongsTo('assignedTo').id()) {
      this.$("#assignee").val(this.get('step.task').belongsTo('assignedTo').id());
    } else {
      this.$("#assignee").val('');
    }
    if (this.get('step.task') && this.get('step.task').belongsTo('approver') && this.get('step.task').belongsTo('approver').id()) {
      this.$("#approver").val(this.get('step.task').belongsTo('approver').id());
    } else {
      this.$("#approver").val('');
    }
  },
  attachments: Ember.computed('step.task.attachments.@each', function() {
    let attachments = [];
    if (this.get('step.task.attachments')) {
      this.get('step.task.attachments').forEach(a => {
        let attachment = a.toJSON();
        attachments.push(attachment);
      });
    }
    return attachments;
  }),
  assignedToId: Ember.computed('step', 'active', 'step.task', function() {
    if (this.get('step') && this.get('step').get('task') && this.get('step').get('task').belongsTo('assignedTo')) {
      return this.get('step').get('task').belongsTo('assignedTo').id();
    } else {
      return null;
    }
  }),
  approverId: Ember.computed('step', 'active', 'step.task', function() {
    if (this.get('step') && this.get('step').get('task') && this.get('step').get('task').belongsTo('approver')) {
      return this.get('step').get('task').belongsTo('approver').id();
    } else {
      return null;
    }
  }),
  actions: {
    updateAction() {
      const self = this;
      this.set('step.node.data.text', this.$('input[name="name"]').val());
      this.set('step.task.title', this.$('input[name="name"]').val());
      this.set('step.description', this.$('textarea[name="description"]').val());
      this.set('step.task.description', this.$('textarea[name="description"]').val());
      this.set('step.task.assignedTo', this.get('users').findBy('id', this.$("#assignee").val()));
      this.set('step.task.approver', this.get('users').findBy('id', this.$("#approver").val()));
      this.get('attachments').forEach(function(a, index) {
        let attachment = self.get('step.task.attachments').objectAt(index);
        if (attachment) {
          if (a._destroy === true) {
            attachment.set('_destroy', true);
          }
        } else {
          attachment = self.get('step.task.attachments').createRecord();
          attachment.set('fileAttachment', a.fileAttachment);
          attachment.set('_destroy', a._destroy);
        }
      });
      this.sendAction('updateAction', this.get('step'), this.$('input[name="name"]').val());
    },
    cancelAction() {
      this.$("#new-attachment").val('');
      this.sendAction('cancelAction');
    },
    removeStep() {
      this.sendAction('removeStep', this.get('step'));
    },
    addAttachment() {
      const file = this.$('#new-attachment')[0].files[0];
      if (file) {
        const attachment = { fileAttachment: file };
        this.get('attachments').pushObject(attachment);
        this.$('#new-attachment').val('');
      } else {
        alert('Please select a file to upload');
      }
    },
    removeAttachment(index) {
      var attachment = this.get('attachments').objectAt(index);
      Ember.set(attachment, '_destroy', true);
    },
    checkCharacter() {
      let description = this.$('textarea[name="description"]').val();
      if(description){
        let descriptionLength = description.length;
        let characterCount = 240;
        this.set('descriptionCharacterCount', characterCount - descriptionLength);
      }else{
        this.set('descriptionCharacterCount', 240);
      }
    },
  }
});
