import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['g-preview'],
  restoreConfirmationVisible: false,
  notification: {
    type: 0,
    msg: ''
  },
  currentUser: Ember.inject.service(),
  isDocOwner: Ember.computed('document', function() {
    return this.get('currentUser.user.id') === (this.get('document.created_by.id') || '').toString();
  }),
  router: Ember.inject.service('-routing'),
  restoring: false,
  actions: {
    restoreVersion() {
      const self = this;
      this.set('restoring', true);
      NProgress.start();
      Ember.$.ajax({
        method: 'PUT',
        url: `/v1/documents/${this.get('document.id')}/revert_version?version_number=${this.get('versionNumber')}`,
        success(response) {
          NProgress.done();
          self.set('restoring', false);
          self.send('showNotification', 'The document version has been restored');
        },
        failure() {
          NProgress.done();
          self.set('restoring', false);
          self.send('showNotification', 'There seems to be some technical glitch. Please try again later');
        }
      });
    },
    showNotification(message) {
      let self = this;
      self.set('notification.type', 3);
      self.set('notification.msg', message);
      setTimeout(function() {
        self.set('notification.type', 0);
        self.get('router').transitionTo('app.documents.document-view', self.get('document.id'));
      }, 2000);
    },
  },
});
