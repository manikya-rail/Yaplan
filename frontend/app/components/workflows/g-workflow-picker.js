import Ember from 'ember';

export default Ember.Component.extend({
  showPreview: false,
  snapshot: null,
  showAnimation: false,
  matchingWorkflows: Ember.computed(
    'workflowTemplates', 'project.categoryId', function() {
      return this.get('workflowTemplates').filter(t => (
        t.get('category.id') === this.get('project').belongsTo('category').id()
      ));
    }
  ),
  newTemplateId: null,
  disabled: Ember.computed('newTemplateId', function() {
    return !this.get('newTemplateId');
  }),
  didReceiveAttrs() {
    this.set('newTemplateId', null);
  },
  // didRender() {
  //   const self = this;
  //   this.$('input[id^=workflow_template_id_]').on('click', function() {
  //     let newTemplateId = this.id.match(/workflow_template_id_(\d+)/)[1];
  //     if (newTemplateId === self.get('newTemplateId')) {
  //       self.set('newTemplateId', null);
  //     } else {
  //       self.set('newTemplateId', newTemplateId);
  //     }
  //   });
  // },
  // didInsertElement() {
  //   const self = this;
  //   this.$('input[id^=workflow_template_id_]').on('click', function() {
  //     let newTemplateId = this.id.match(/workflow_template_id_(\d+)/)[1];
  //     if (newTemplateId === self.get('newTemplateId')) {
  //       self.set('newTemplateId', null);
  //     } else {
  //       self.set('newTemplateId', newTemplateId);
  //     }
  //   });
  // },
  actions: {
    assignWorkflow() {
      this.set('showAnimation', true);
      this.sendAction('assignWorkflow', this.get('newTemplateId'));
    },
    generatePreview(workflow) {
      this.set('snapshot', workflow.get('snapshot.url'));
      this.set('showPreview', true);
    },
    setTemplateId(templateId) {
      if (templateId === this.get('newTemplateId')) {
        this.set('newTemplateId', null);
      } else {
        this.set('newTemplateId', templateId);
      }
    }
  }
});
