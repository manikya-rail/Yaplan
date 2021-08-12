import Ember from 'ember';
import * as _ from 'lodash';

export default Ember.Component.extend({
  store: Ember.inject.service('store'),
  descriptionCharacterCount: 0,
  documentPickerActive: false,
  showEditMode: true,
  selectedDocument: Ember.computed('step', 'active', {
    get(key) {
      return this.get('step.task');
    },
    set(key, value) {
      return value;
    }
  }),
  justChangedDoc: false,
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
    if (this.get('step') && this.get('active') && !this.get('justChangedDoc')) {
      if (this.get('step.task') && this.get('step.task').belongsTo('assignedTo') && this.get('step.task').belongsTo('assignedTo').id()) {
        this.$('#assignee').val(this.get('step.task').belongsTo('assignedTo').id());
      } else {
        this.$('#assignee').val('');
      }
      if (this.get('step.task') && this.get('step.task').belongsTo('approver') && this.get('step.task').belongsTo('approver').id()) {
        this.$('#approver').val(this.get('step.task').belongsTo('approver').id());
      } else {
        this.$('#approver').val('');
      }
    } else if (!this.get('justChangedDoc')) {
      this.$('#assignee').val('');
      this.$('#approver').val('');
    }
  },
  assignedToId: Ember.computed('active', {
    get(key) {
      if (this.get('step') && this.get('step').get('task')) {
        return this.get('step').get('task').belongsTo('assignedTo').id();
      }
      return '';
    },
    set(key, value) {
      return value;
    }
  }),
  approverId: Ember.computed('active', {
    get(key) {
      if (this.get('step') && this.get('step').get('task')) {
        return this.get('step').get('task').belongsTo('approver').id();
      }
      return '';
    },
    set(key, value) {
      return value;
    }
  }),
  user: Ember.computed('users', function () {
    return this.get('users');
  }),
  actions: {
    updateDocumentInfo() {
      const step = this.get('step');
      // step.set('node.data.text', this.$('input[name="name"]').val());
      if (this.get('selectedDocument')) {
        this.set('step.node.data.text', this.$('input[name="name"]').val());
        step.set('description', this.$('textarea[name="description"]').val());
        step.set('task', this.get('selectedDocument'));
        step.set('task.assignedTo', this.get('users').findBy('id', this.$('#assignee').val()));
        step.set('task.approver', this.get('users').findBy('id', this.$('#approver').val()));
        this.set('justChangedDoc', false);
        this.sendAction(
          'updateDocumentInfo', step, this.$('input[name="name"]').val(),
        );
      } else {
        alert('Select a document to continue');
      }
    },
    cancelDocumentInfo() {
      this.toggleProperty('active');
      this.set('justChangedDoc', false);
      this.sendAction('cancelDocumentInfo');
    },
    selectDocument(documentId) {
      this.set('justChangedDoc', true);
      this.set('selectedDocument', this.get('docs').findBy('id', documentId));
      this.set('documentPickerActive', false);
    },
    removeStep() {
      this.sendAction('removeStep', this.get('step'));
    },
    setAssignee(assignedToId) {
      if (_.isEmpty(assignedToId)) {
        this.set('assignedToId', null);
      } else {
        this.set('assignedToId', assignedToId);
      }
    },
    showDocumentPicker() {
      this.set('justChangedDoc', true);
      this.set('documentPickerActive', true);
    },
    setApprover(approverId) {
      if (_.isEmpty(approverId)) {
        this.set('approverId', null);
      } else {
        this.set('approverId', approverId);
      }
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
