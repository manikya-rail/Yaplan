import Ember from 'ember';
let inject = Ember.inject;

export default Ember.Component.extend({

  store: Ember.inject.service(),
  title: '',
  documentDescription: '',
  descriptionCharacterCount: 0,
  newProjectId: null,
  showProjectOptions: true,
  
  notification: {
    type: 0,
    msg: ''
  },

  isNotFilled: Ember.computed('title', 'documentDescription', function() {
    return (!this.get('title') || !this.get('documentDescription'));
  }),

  initFormFields: function() {
    $("#datepickers").datepicker({
      dateFormat: "dd-mm-yy",
    });

    $("#datepickere").datepicker({
      dateFormat: "dd-mm-yy"
    });

    $("#datepickers").datepicker("option", "minDate", new Date());
    $("#datepickere").datepicker("option", "minDate", new Date());

    if (this.get('document') !== null) {
      let tempDocument = this.get("document");

      if (this.get("document.proposed_startdate")) {
        $("#datepickers").datepicker("setDate", new Date(this.get("document.proposed_startdate")));
      } else {
        $("#datepickers").datepicker("setDate", new Date());
      }

      if (this.get("document.proposed_enddate")) {
        $("#datepickere").datepicker("setDate", new Date(this.get("document.proposed_enddate")));
      } else {
        $("#datepickere").datepicker("setDate", new Date());
      }

      this.set('title', this.get("document.title"));
      this.set('documentDescription', this.get("document.description"));
      this.send('checkCharacter');
    } else {
      this.set('title', '');
      this.set('documentDescription', '');
      this.send('checkCharacter');
    }

  }.on('didReceiveAttrs'),

  actions: {
    updateDetails: function() {
      const self = this;
      var store = this.get('store');
      var title = self.get("title");
      var description = self.get("documentDescription");
      if (this.get('document.is_template')) {
        store.findRecord('document', self.get('document.id')).then(function(document) {
          document.set("title", title);
          document.set("description", description);
          document.save();
          self.set('notification.type', 3);
          self.set('notification.msg', "Document updated Successfully");
          setTimeout(function() {
            self.set('notification.type', 0);
            self.set('active', false);
            self.sendAction('refreshPage');
          }, 2000);
        });
      } else {
        store.findRecord('document', self.get('document.id')).then(function(document) {
          document.set("title", title);
          document.set("description", description);
          document.set("proposed_startdate", $("#datepickers").val());
          document.set("proposed_enddate", $("#datepickere").val());
          document.save();
          self.set('notification.type', 3);
          self.set('notification.msg', "Document updated Successfully");
          setTimeout(function() {
            self.set('notification.type', 0);
            self.set('active', false);
            self.sendAction('refreshPage');
          }, 2000);
        });
      }
    },

    checkCharacter() {
      let description = this.get('documentDescription');
      if (description) {
        let descriptionLength = description.length;
        let characterCount = 240;
        this.set('descriptionCharacterCount', characterCount - descriptionLength);
      } else {
        this.set('descriptionCharacterCount', 240);
      }
    },

    createDocument() {
      const self = this;
      let store = this.get('store');
      let title = this.get('title');
      let description = self.get("documentDescription");
      let project_id = null;
      let radio_button_value = $('input[name=documenttype]:checked').val();
      if(self.projectID) {
        project_id = self.projectID;
        NProgress.start();
        store.queryRecord('project', { id: project_id }).then(function(res) {
          const doc = store.createRecord('document');
          doc.set('project', res);
          doc.set("title", title);
          doc.set("description", description);
          doc.save().then((d) => {
            NProgress.done();
            self.set('notification.type', 3);
            self.set('notification.msg', "Document Created Successfully");
            setTimeout(function() {
              self.set('notification.type', 0);
              self.set('active', false);
              self.get('router').transitionTo('app.documents.editor', doc.id);
            }, 2000);
          });
        });
      } else {
        if (radio_button_value == 'manual') {
          if (self.get('allProjects')) {
            let project_id_new = parseInt(document.getElementById('document-project').value);
            self.set('newProjectId', project_id_new);
            project_id = self.get('newProjectId');
          } else {
            project_id = self.projectID
          }
          NProgress.start();
          store.queryRecord('project', { id: project_id }).then(function(res) {
            const doc = store.createRecord('document');
            doc.set('project', res);
            doc.set("title", title);
            doc.set("description", description);
            doc.save().then((d) => {
              NProgress.done();
              self.set('notification.type', 3);
              self.set('notification.msg', "Document Created Successfully");
              setTimeout(function() {
                self.set('notification.type', 0);
                self.set('active', false);
                self.get('router').transitionTo('app.documents.editor', doc.id);
              }, 2000);
            });
          });
        } else {
          NProgress.start();
          let category_id = parseInt(document.getElementById('document-category').value);
          let documentObject = {};
          documentObject.document = {};
          documentObject.document.title = self.get('title');
          documentObject.document.category_id = category_id;
          documentObject.document.description = self.get('documentDescription');
          $.ajax({
            type: "POST",
            url: "v1/documents",
            data: documentObject,
            success: function(data) {
              NProgress.done();
              if(data.document){
                self.set('notification.type', 3);
                self.set('notification.msg', "Document Created Successfully");
                setTimeout(function() {
                  self.set('notification.type', 0);
                  self.set('active', false);
                  self.get('router').transitionTo('app.documents.editor', data.document.id);
                }, 2000);
              }
            },
            error: function(xhr, textStatus, errorThrown, data) {
              NProgress.done();
              self.set('notification.type', 3);
              self.set('notification.msg', "Sorry, There was a problem in creating a Standalone document");
              setTimeout(function() {
                self.set('notification.type', 0);
                self.set('active', false);
              }, 2000);
            },
            failure: function() {
              NProgress.done();
              self.set('notification.type', 3);
              self.set('notification.msg', "Sorry, There was a problem in creating a Standalone document");
              setTimeout(function() {
                self.set('notification.type', 0);
                self.set('active', false);
              }, 2000);
            }
          });
        }
      }
    },

    checkDocCreateOption(option) {
      if (option == 'manual') {
        this.set('showProjectOptions', true);
      } else {
        this.set('showProjectOptions', false);
      }
    },

  }

});
