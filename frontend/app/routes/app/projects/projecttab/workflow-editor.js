import Ember from 'ember';

export default Ember.Route.extend({
  cy: null,
  cyJson: null,
  dirty: false,
  model(params, transition) {
    return Ember.RSVP.hash({
      project: this.get('store').findRecord(
        'Project', transition.params['app.projects.projecttab'].id,
      ),
      collaborations: this.store.query('collaboration', {
        project_id: transition.params['app.projects.projecttab'].id,
      }),
      collaborators: this.store.query('collaborator', {
        project_id: transition.params['app.projects.projecttab'].id,
      }),
      documents: this.store.query('task', {
        project_id: transition.params['app.projects.projecttab'].id,
        type: 'Document', include_templates: true,
      }),
      projectWorkflow: this.store.queryRecord(
        'ProjectWorkflow', {
          project_id: transition.params['app.projects.projecttab'].id
        },
      ),
    });
  },
  notification: {
    type: 0,
    msg: '',
  },
  updated: false,
  actions: {
    save(projectWorkflow, cb) {
      // console.log(projectWorkflow);
      const self = this;
      projectWorkflow.save().then(
        () => {
          // self.send('reloadPage');
          self.send('makeDirty', false);
          self.send('setCyJson', self.get('cy').json());
          cb();
        }
      ).catch(error => cb(error));
    },
    reloadPage() {
      this.refresh();
    },
    setCy(cy) {
      this.set('cy', cy);
    },
    setCyJson(json) {
      this.set('cyJson', json);
    },
    makeDirty(yesOrNo) {
      this.set('dirty', yesOrNo);
    },
    willTransition(transition) {
      if (this.get('dirty') || !_.isEqual(this.get('cy').json(), this.get('cyJson'))) {
        const confirmation = confirm(
          'You have unsaved changes. Are you sure you want to leave the page?',
        );
        if (!confirmation) {
          transition.abort();
        }
      }
    }
  }
});
