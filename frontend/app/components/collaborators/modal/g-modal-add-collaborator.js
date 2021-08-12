import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),

  email: '',
  message: '',
  nameData: [],
  nameArray: [],
  emailData: [],
  emailArray: [],
  choice: {
    project: null,
    document: null
  },
  notification: {
    type: 0,
    msg: ''
  },
  project_id: null,
  document_id: null,
  active: false,

  didReceiveAttrs: function() {

    if (this.get('projects') != null) return;

    Ember.run.scheduleOnce('afterRender', this, function() {
      let projects = this.get('store').findAll('project');
      this.set('projects', projects);
    });
  },


  visiblityObserver: Ember.observer('active', function() {
    this.set('name', '');
    this.set('email', '');
    this.set('message', '');
    this.set('choice.project', null);
    this.set('choice.document', null);
    this.set('notification.type', 0);
  }),

  init() {
    this._super(...arguments);
    this.set('email', '');
    this.set('message', '');
    this.set('name', '');
  },


  // isNotFilled: Ember.computed('email','choice.document', function(){
  // 	var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;
  // 	if (this.get('limited'))
  // 		return (_.isEmpty(this.get('name')) || _.isEmpty(this.get('email')) || _.isEmpty(this.get('message')) || !emailPattern.test(this.get('email')));
  // 	else
  // 		return !this.get('email') || this.get('choice.document')==null || this.get('choice.document')==0;
  // }),

  isNotFilled: Ember.computed('name', 'email', 'message', function() {
    // var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    this.set('name', $('#uname').val());
    this.set('email', $('#uemail').val());
    var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;
    return (_.isEmpty(this.get('name')) || _.isEmpty(this.get('email')) || _.isEmpty(this.get('message')) || !emailPattern.test(this.get('email')));
  }),

  actions: {
    addCollaborator: function() {
      let componentContext = this;
      let documents = this.get('documents');
      let document_id = 0;
      let toastMessage = "Collaborator Invited to a Document Successfully";

      if (this.get('limited'))
        document_id = this.get('document').get('id');
      else
        document_id = this.get('choice.document');

      $.ajax({
        type: 'GET',
        url: '/v1/collaborators?document_id=' + document_id,
        dataType: 'json',
        success: function(data) {
          let existingCollaborators = data.collaborators;
          if (!existingCollaborators.isAny('email', componentContext.get('email'))) {
            componentContext.get('store').find('document', document_id).then(res => {
              let collaborators = [];
              let collaborator = {};
              collaborator.name = componentContext.get('name');
              collaborator.email = componentContext.get('email');
              collaborators.pushObject(collaborator);
              var ProjectInvitation = res.store.createRecord('invitations');
              ProjectInvitation.setProperties({
                message: componentContext.get('message'),
                document_id: document_id,
                collaborators: collaborators
              });
              ProjectInvitation.save().then(function() {
                componentContext.set('active', false);
                componentContext.sendAction('collaboratorAdded');
                componentContext.sendAction('showMessage', toastMessage);
              }, function(error) {
                componentContext.set('active', false);
                componentContext.sendAction('collaboratorAdded');
                componentContext.sendAction('showMessage', toastMessage);
              });
            });
          } else {
            let existing_collaborator = existingCollaborators.find(x => x.email === componentContext.get('email'));
            if(existing_collaborator.status == 'pending') {
              componentContext.get('store').find('document', document_id).then(res => {
                let collaborators = [];
                let collaborator = {};
                collaborator.name = componentContext.get('name');
                collaborator.email = componentContext.get('email');
                collaborators.pushObject(collaborator);
                var ProjectInvitation = res.store.createRecord('invitations');
                ProjectInvitation.setProperties({
                  message: componentContext.get('message'),
                  document_id: document_id,
                  collaborators: collaborators
                });
                ProjectInvitation.save().then(function() {
                  componentContext.set('active', false);
                  componentContext.sendAction('collaboratorAdded');
                  componentContext.sendAction('showMessage', toastMessage);
                }, function(error) {
                  componentContext.set('active', false);
                  componentContext.sendAction('collaboratorAdded');
                  componentContext.sendAction('showMessage', toastMessage);
                });
              });
            } else {
              toastMessage = "Collaborator already exists";
              componentContext.set('active', false);
              componentContext.sendAction('collaboratorAdded');
              componentContext.sendAction('showMessage', toastMessage);
            }
          }
        },
        error: function(xhr, textStatus, errorThrown, data) {
          toastMessage = "Oops!, Seems like there is a technical glitch, Please try again";
          componentContext.set('active', false);
          componentContext.sendAction('collaboratorAdded');
          componentContext.sendAction('showMessage', toastMessage);
        }
      });


    },
    projectChanged: function(selectedProjectId) {

      let projects = this.get('projects');
      if (selectedProjectId == 0) {
        this.set('documents', null);
      } else {
        let selectedProject = projects.findBy('id', selectedProjectId);
        this.set('documents', selectedProject.get('documents'));
      }

    },

    findNameArray() {
      let componentContext = this;
      $.ajax({
        type: 'GET',
        url: '/v1/collaborators/search_collaborators?name=' + $('#uname').val(),
        dataType: 'json',
        success: function(data) {
          if (data !== null) {
            if (data.users) {
              let name_array = data.users;
              componentContext.set('nameData', data.users);
              let c = [];
              name_array.forEach(function(key, value) {
                c.push(key.full_name);
              });
              componentContext.set('nameArray', c);
            } else {
              componentContext.set('nameArray', []);
            }
          } else {
            componentContext.set('nameArray', []);
          }
        },
        error: function(xhr, textStatus, errorThrown, data) {
          componentContext.set('nameArray', []);
        }
      });

      $("#uname").autocomplete({
        source: this.get('nameArray'),
        minLength: 0,
        appendTo: '#nameResult',
        select: function(event, ui) {
          $('#uname').val(ui.item.value);
          componentContext.set('name', ui.item.value);
          let a = componentContext.get('nameArray');
          let i = a.indexOf(ui.item.value);
          let b = componentContext.get('nameData');
          let val = b[i];
          $('#uemail').val(val.email);
          componentContext.set('email', val.email);
          $('#uname').blur();
          return false;
        },
      }).focus(function() {
        $(this).autocomplete("search");
      });

      if (componentContext.get('nameArray').length == 0) {
        componentContext.set('name', $('#uname').val());
      }

      if ($('#uname').val().length == 0) {
        $('#uname').autocomplete("destroy");
      }
    },

    findEmailArray() {
      let componentContext = this;
      $.ajax({
        type: 'GET',
        url: '/v1/collaborators/search_collaborators?email=' + $('#uemail').val(),
        dataType: 'json',
        success: function(data) {
          if (data !== null) {
            if (data.users) {
              let name_array = data.users;
              componentContext.set('emailData', data.users);
              let c = [];
              name_array.forEach(function(key, value) {
                c.push(key.email);
              });
              componentContext.set('emailArray', c);
            } else {
              componentContext.set('emailArray', []);
            }
          } else {
            componentContext.set('emailArray', []);
          }
        },
        error: function(xhr, textStatus, errorThrown, data) {
          componentContext.set('emailArray', []);
        }
      });

      $("#uemail").autocomplete({
        source: this.get('emailArray'),
        minLength: 0,
        appendTo: '#emailResult',
        select: function(event, ui) {
          $('#uemail').val(ui.item.value);
          componentContext.set('email', ui.item.value);
          let a = componentContext.get('emailArray');
          let i = a.indexOf(ui.item.value);
          let b = componentContext.get('emailData');
          let val = b[i];
          $('#uname').val(val.full_name);
          componentContext.set('name', val.full_name);
          $('#uemail').blur();
          return false;
        },
      }).focus(function() {
        $(this).autocomplete("search");
      });

      if (componentContext.get('emailArray').length == 0) {
        componentContext.set('email', $('#uemail').val());
      }

      if ($('#uemail').val().length == 0) {
        $('#uemail').autocomplete("destroy");
      }
    },
  }
})
