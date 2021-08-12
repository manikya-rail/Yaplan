import Ember from 'ember';

export default Ember.Component.extend({
  descriptionCharacterCount: 0,
  didReceiveAttrs() {
    if (this.get('step')) {
      this.$('input[name="name"]').val(this.get('step.node.data.text'));
      this.$('textarea[name="description"]').val(this.get('step.description'));
      this.send('checkCharacter');
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
  actions: {
    updateAction() {
      let self = this;
      this.set('step.node.data.text', this.$('input[name="name"]').val());
      this.set('step.task.title', this.$('input[name="name"]').val());
      this.set('step.description', this.$('textarea[name="description"]').val());
      this.set('step.task.description', this.$('textarea[name="description"]').val());
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
      this.sendAction(
        'updateAction', this.get('step'),
        this.$('input[name="name"]').val(),
      );
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
    cancelAction() {
      this.$("#new-attachment").val('');
      this.sendAction('cancelAction');
    },
    removeStep() {
      this.sendAction('removeStep', this.get('step'));
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
  },
});
