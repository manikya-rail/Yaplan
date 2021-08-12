import Ember from 'ember';
import * as _ from 'lodash';
export default Ember.Route.extend({
  store: Ember.inject.service('store'),
  cy: null,
  cyJson: null,
  dirty: false,
  model(params) {
    return Ember.RSVP.hash({
      workflowTemplate: this.get('store').queryRecord('workflow-template', { id: params.id }),
      documents: this.get('store').query('document-template', {
        is_public: true,
      }),
      categories: this.get('store').query('category', {}),
    });
  },
  actions: {
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
      this.get('cy').nodes().unselect();
      // this.get('cy').edges().unselect();
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
