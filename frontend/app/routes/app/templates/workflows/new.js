import Ember from 'ember';

export default Ember.Route.extend({
  store: Ember.inject.service('store'),
  currentUser: Ember.inject.service('current-user'),
  dirty: true,
  model() {
    return Ember.RSVP.hash({
      workflowTemplate: this.get('store').createRecord('workflow-template', {
        isPublic: this.get('currentUser.user.role.name') === 'admin' ? true : false
      }),
      documents: this.get('store').query('document-template', {
        is_public: true
      }),
      categories: this.get('store').findAll('category'),
    });
  },
  actions: {
    clean() {
      this.set('dirty', false);
    },
    willTransition(transition) {
      if (this.get('dirty')) {
        const confirmation = confirm(
          'Are you sure you want to leave the page?'
        );
        if (!confirmation) {
          NProgress.done();
          transition.abort();
        }
      }
    },

  }
});
