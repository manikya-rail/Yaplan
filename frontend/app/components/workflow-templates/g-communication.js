import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service('store'),
  name: Ember.computed('step', function() {
    return this.get('step.node.data.text');
  }),
  communication: Ember.computed('step', function() {
    return this.get('step.communications.firstObject');
  }),
  attachments: Ember.computed('communication.attachments.@each', function() {
    let attachments = [];
    if (this.get('communication.attachments')) {
      this.get('communication.attachments').forEach(a => {
        let attachment = a.toJSON();
        attachments.push(attachment);
      });
    }
    return attachments;
  }),
  didReceiveAttrs() {
    if (this.get('step') && this.get('active')) {
      this.$('input[name="subject"]').val(this.get('step.communications.firstObject.subject'));
      this.$('textarea[name="message"]').val(this.get('step.communications.firstObject.message'));
      this.$('select[name="communication_mode"]').val(this.get('step.communications.firstObject.communicationMode') || 'approved');
    }
  },
  actions: {
    updateCommunication() {
      const self = this;
      const communication = this.get('communication');
      communication.set('subject', this.$('input[name="subject"]').val());
      communication.set('message', this.$('textarea[name="message"]').val());
      communication.set('communicationMode', this.$('select[name="communication_mode"]').val())
      communication.set('recepientEmails', this.get('recepientEmails'));
      this.get('attachments').forEach(function(a, index) {
        let attachment = communication.get('attachments').objectAt(index);
        if (attachment) {
          if (a._destroy === true) {
            attachment.set('_destroy', true);
          }
        } else {
          attachment = communication.get('attachments').createRecord();
          attachment.set('fileAttachment', a.fileAttachment);
          attachment.set('_destroy', a._destroy);
        }
      });
      const step = this.get('step');
      step.set('node.data.text', this.$('input[name="name"]').val());
      if (this.get('step.communications').objectAt(0)) {
        this.get('step.communications').insertAt(0, communication);
      } else {
        this.get('step.communications').pushObject(communication);
      }
      this.sendAction(
        'updateCommunication',
        step, this.$('input[name="name"]').val()
      );
    },
    removeAttachment(index) {
      var attachment = this.get('attachments').objectAt(index);
      Ember.set(attachment, '_destroy', true);
    },
    cancelCommunication() {
      this.$("#new-attachment").val('');
      this.sendAction('cancelCommunication');
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
    removeStep() {
      this.sendAction('removeStep', this.get('step'));
    },
  }
});
