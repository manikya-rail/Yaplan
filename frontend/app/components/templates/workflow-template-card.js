import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['workflow-block'],
  onWorkflowInfo: false,
  snapshot: null,
  showPreview: false,
  image: Ember.computed('template', function() {
    return new Ember.Handlebars.SafeString(
      `background-image: url('${this.get('template.snapshot.url')}')`
    );
  }),
  projectId: Ember.computed('template', function() {
    if (this.get('projectWorkflow')) {
      return this.get('template').belongsTo('project').id();
    } else {
      return null;
    }
  }),
  actions:{
    showWorkflowInfo(template) {
      this.set('onWorkflowInfo', true);
    },

    generatePreview(template) {
      this.set('snapshot', template.get('snapshot.url'));
      this.set('showPreview', true);
    }
  }
});
