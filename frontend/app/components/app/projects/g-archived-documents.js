import Ember from 'ember';

export default Ember.Component.extend({
  router: Ember.inject.service('-routing'),
  archiveddocuments: null,
  users: Ember.inject.service(),
  time_zone: '',
  isTile: true,
  isList: false,
  infoDoc: false,
  documentinformation: null,
  notification: {
    type: 0,
    msg: ''
  },

  didReceiveAttrs() {
    this._super(...arguments);
    Ember.run.scheduleOnce('afterRender', this, function() {
      const self = this;
      let ttime = self.get('users').getTimeZone();
      self.set('time_zone', ttime);
    });
  },

  actions: {

    restoreDocument(id, project) {
      NProgress.start();
      const self = this;
      $.ajax({
        type: "PUT",
        url: "v1/documents/" + id + "/unarchive",
        dataType: "text",
      }).done(function(data, statusText, xhr) {
        var status = xhr.status;
        if (status == '200') {
          NProgress.done();
          self.set('notification.type', 3);
          self.set('notification.msg', "Document was Restored");
          setTimeout(function() {
            self.set('notification.type', 0);
            self.sendAction('refreshPage');
            self.get('router').transitionTo('app.projects.projecttab.document', project.get('id'));
          }, 2000);
        } else {
          NProgress.done();
          self.sendAction('refreshPage');
          self.get('router').transitionTo('app.projects.projecttab.document', project.get('id'));
        }
      });
    },

    isListdata() {
      this.toggleProperty('isTile');
      this.toggleProperty('isList');
    },

    isTiledata() {
      this.toggleProperty('isTile');
      this.toggleProperty('isList');
    },

    showDocumentInfo(doc) {
      this.set('documentinformation', doc);
      this.toggleProperty('infoDoc');
    },

  }

});