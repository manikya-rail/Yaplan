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
      this.$('textarea[name="description"]')[0].value = (this.get('step.description') || '');
      this.send('checkCharacter');
    }
  },
  didRender() {
    if (this.get('step.task') && this.get('step.task').belongsTo('assignedTo') && this.get('step.task').belongsTo('assignedTo').id()) {
      this.$("#assignee").val(this.get('step.task').belongsTo('assignedTo').id());
    } else {
      this.$("#assignee").val('');
    }
  },
  assignedToId: Ember.computed('step', function() {
    if (this.get('step') && this.get('step').get('task')) {
      return this.get('step').get('task').belongsTo('assignedTo').id()
    } else {
      return null;
    }
  }),
  actions: {
    cancelDecision() {
      this.$('textarea[name="description"]').val(this.get('step.description') || '');
      this.sendAction('cancelDecision');
    },
    updateDecision() {
      this.set('step.task.title', this.$('input[name="name"]').val());
      this.set('step.node.data.text', this.$('input[name="name"]').val());
      this.set('step.description', this.$('textarea[name="description"]').val());
      this.set('step.task.description', this.$('textarea[name="description"]').val());
      this.set('step.task.assignedTo', this.get('users').findBy('id', this.$("#assignee").val()));
      this.sendAction(
        'updateDecision', this.get('step'), this.$('input[name="name"]').val()
      );
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
  }
});
