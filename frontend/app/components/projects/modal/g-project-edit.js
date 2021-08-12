import Ember from 'ember';
import * as _ from 'lodash';

export default Ember.Component.extend({
  projects: Ember.inject.service(),
  store: Ember.inject.service(),
  step1: true,
  snapshot: null,
  showPreview: false,
  active: false,
  descriptionCharacterCount: 0,
  cancelConfirmActive: false,
  isNotFilled: Ember.computed(
    'project', 'category', 'project.title',
    'project.description', 'step1', 'disabled',
    function () {
      return _.isEmpty(this.get('project.description')) ||
        _.isEmpty(this.get('project.title')) || !this.get('category') ||
        this.get('disabled');
    },
  ),
  isNotWorkflowSelected: Ember.computed(
    'step1', 'workflow_template_id', function () {
      return !this.get('workflow_template_id');
    },
  ),
  filteredTemplates: Ember.computed(
    'category', 'workflowTemplates', function () {
      const self = this;
      return this.get('workflowTemplates').filter(
        template => template.get('category').get('id') === self.get(
          'category',
        ),
      );
    },
  ),
  sortProps: 'updatedAt',
  Categories: Ember.computed.sort('Category', function(category1, category2) {
    let result = 0;
    let item1, item2;
    switch (this.get('sortProps')) {
      case 'updatedAt':
        item1 = category2.get('updatedAt');
        item2 = category1.get('updatedAt');
        break;
      case 'title':
        item1 = category1.get('name').trim().toLowerCase();
        item2 = category2.get('name').trim().toLowerCase();
        break;
    }
    if (item1 < item2) {
      result = -1;
    } else if (item1 > item2) {
      result = 1;
    } else {
      result = 0;
    }
    return result;
  }),

  category: Ember.computed('project.category', function () {
    return this.get('project').belongsTo('category').id();
  }),
  workflow_template_id: Ember.computed('project.workflow_template_id', function () {
    return this.get('project.workflow_template_id');
  }),
  /**
   * Initializes nice nao inputs
   */
  initNaoInput: function () {
    Ember.run.scheduleOnce('afterRender', this, function () {
      const self = this;
      self.$('body').setupNaoInput();
      self.$('form input, textarea').change(function () {
        if (this.name === 'title' || this.name === 'description') {
          self.get('project').set(this.name, self.$(this).val());
        }
      });
    });
  }.on('didInsertElement'),

  initFormFields: function(){  

    if(this.get('project') !== null) {
      let s_project = this.get("project");
      
      this.set('project.description', this.get("project.description"));
      this.send('checkCharacter');
    } else {
      this.set('project.description', '');
      this.send('checkCharacter');
    }

  }.on('didReceiveAttrs'),

  isSelected(type, value) {
    return this.get(type) === value.toString();
  },

  actions: {
    setCheckedValue(type, value) {
      if (type === 'category') {
        if (this.get('category') !== value) {
          this.set(type, value);
          this.set('workflow_template_id', null);
        } else {
          this.set(type, null);
        }
      } else if (this.get('workflow_template_id') && value && this.get('workflow_template_id').toString() === value) {
        this.set('workflow_template_id', null);
      } else {
        this.set(type, value);
      }
    },
    generatePreview(workflow) {
      this.set('snapshot', workflow.get('snapshot.url'));
      this.set('showPreview', true);
    },
    proceed() {
      if (this.get('step1')) {
        if (this.get('project').get('id')) {
          const pid = this.get('project').get('id');
          this.set(
            'project.category',
            this.get('Categories').findBy('id', this.get('category')),
          );
          this.set('disabled', true);
          this.sendAction('createproject', this.get('project'));
          this.sendAction('showNotification', 'Project updated Successfully');
          this.sendAction('refreshPage');
          // window.location.reload();
        } else {
          this.set('step1', false);
        }
      } else {
        this.set('disabled', true);
        this.set(
          'project.category',
          this.get('Categories').findBy('id', this.get('category')),
        );
        this.set(
          'project.workflow_template_id',
          this.get('workflow_template_id'),
        );
        this.sendAction('createproject', this.get('project'));
      }
    },
    goBack() {
      this.set('step1', true);
    },

    cancelEdit() {
      this.get('project').rollbackAttributes();
      this.set('category', this.get('project').belongsTo('category').id());
      this.set('workflow_template_id', this.get('project.workflow_template_id'));
      this.set('active', false);
    },

    checkCharacter(){
      let description = this.get('project.description');
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
