import Ember from 'ember';

export default Ember.Component.extend({
  documentPickerActive: false,
  descriptionCharacterCount: 0,
  didReceiveAttrs({ oldAttrs, newAttrs }) {
    if (this.get('step')) {
      if (
        oldAttrs && oldAttrs.active &&
          oldAttrs.active.value !== newAttrs.active.value
      ) {
        this.$('input[name="name"]').val(this.get('step.node.data.text'));
        this.$('textarea[name="description"]').val(this.get('step.description'));
        this.send('checkCharacter');
      }
    }
  },
  actions: {
    updateDocumentInfo() {
      this.set('step.node.data.text', this.$('input[name="name"]').val());
      this.set('step.description', this.$('textarea[name="description"]').val());
      this.set('step.node.document_id', this.get('selectedDocument.id'));
      this.set('step.task_id', this.get('selectedDocument.id'));
      this.set('step.node.data.document_id', this.get('selectedDocument.id'));
      this.sendAction(
        'updateDocumentInfo', this.get('step'),
        this.$('input[name="name"]').val(),
      );
    },
    cancelDocumentInfo() {
      this.sendAction('cancelDocumentInfo');
    },
    selectDocument() {

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
