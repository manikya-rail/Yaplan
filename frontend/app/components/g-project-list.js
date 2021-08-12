import Ember from 'ember';

export default Ember.Component.extend({

  store: Ember.inject.service(),
  router: Ember.inject.service(),
  documents: Ember.inject.service(),
  showMessage: false,
  notification: {
    type: 0,
    msg: ''
  },

  setupProjects: function() {
    const self = this;
    self.set('showMessage', true);
    if(self.get('projects')){
    	self.set('showMessage', false);
    }
  }.on('didReceiveAttrs'),

  actions: {
    selectProject(projectID, projectTitle, project) {
      const self = this;

      if (self.get('template')) {
        NProgress.start();
        var documentObject = {
          "document": {
            "project_id": projectID
          },
          "duplicate_from_id": self.get('template.id')
        };
        $.ajax({
          type: "POST",
          url: "v1/documents",
          data: documentObject,
          success: function(data) {
            NProgress.done();
            self.set('notification.type', 3);
            self.set('notification.msg', "Document has been created under " + projectTitle + " Successfully.");
            setTimeout(function() {
              self.set('notification.type', 0);
              self.set('active', false);
            }, 2000);
          },
          failure: function() {
            NProgress.done();
            self.set('notification.type', 3);
            self.set('notification.msg', "Sorry, There was a technical glitch in creating a document");
            setTimeout(function() {
              self.set('notification.type', 0);
              self.set('active', false);
            }, 2000);
          }
        });
      } else {
        NProgress.start();
        var store = self.get('store');
        store.queryRecord('project', { id: projectID }).then(function(res){
          let document = store.createRecord('document', {
          title: 'Untitled document',
          project: res
        });
        document.save().then(function(document) {
          self.set('notification.type', 3);
          NProgress.done();
          self.set('notification.msg', "Document has been created under " + projectTitle + " Successfully.");
          setTimeout(function() {
            self.set('notification.type', 0);
            self.get('router').transitionTo('app.documents.editor', document.id);
            self.set('active', false);
          }, 2000);
        });
        }) 
      }
    },
  }


});
