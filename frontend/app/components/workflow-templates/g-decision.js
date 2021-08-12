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
  actions: {
    updateDecision() {
      this.set('step.node.data.text', this.$('input[name="name"]').val());
      this.set('step.description', this.$('textarea[name="description"]').val());
      this.sendAction(
        'updateDecision', this.get('step'),
        this.$('input[name="name"]').val(),
      );
    },
    cancelDecision() {
      this.sendAction('cancelDecision');
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
