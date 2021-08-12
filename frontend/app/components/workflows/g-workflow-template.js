import Ember from 'ember';

export default Ember.Component.extend({
  router: Ember.inject.service('-routing'),
  currentUser: Ember.inject.service(),
  onWorkflowInfo: false,
  workflowInfo: null,
  selectedWorkflow: null,
  snapshot: null,
  showPreview: false,
  sortProps: 'updatedAt',
  users: Ember.inject.service(),
  time_zone: '',
  wid: '',
  sortedTemplates: Ember.computed.sort('workflowTemplates', function(wf1, wf2) {
    let result = 0;
    let item1, item2;
    switch (this.get('sortProps')) {
      case 'updatedAt':
        item1 = wf2.get('updatedAt');
        item2 = wf1.get('updatedAt');
        break;
      case 'title':
        item1 = wf1.get('name').trim().toLowerCase();
        item2 = wf2.get('name').trim().toLowerCase();
        break;
      case 'project':
        item1 = wf1.get('projectName').trim().toLowerCase();
        item2 = wf2.get('projectName').trim().toLowerCase();
        break;
      case 'category':
        item1 = this.get('categories').findBy(
          'id', wf1.belongsTo('category').id()
        ).get('name').trim().toLowerCase();
        item2 = this.get('categories').findBy(
          'id', wf2.belongsTo('category').id()
        ).get('name').trim().toLowerCase();
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
  didReceiveAttrs: function() {
    this._super(...arguments);
    Ember.run.scheduleOnce('afterRender', this, function() {
      const self = this;
      let ttime = self.get('users').getTimeZone();
      self.set('time_zone', ttime);
      console.log(self.get('time_zone'));
    });
  },
  didInsertElement() {
    const self = this;
    Ember.$('#add-template').on('click', function() {
      self.router.transitionTo('app.templates.workflows.new');
    });
  },
  actions: {
    showWorkflowInfo(template) {
      this.set('workflowInfo', template);
      this.set('onWorkflowInfo', true);
    },
    setSortProps(prop) {
      this.set('sortProps', prop);
      this.notifyPropertyChange('workflowTemplates');
    },
    generatePreview(template) {
      this.set('selectedWorkflow', template);
      this.set('snapshot', template.get('snapshot.url'));
      this.set('showPreview', true);
    }
  }
});
