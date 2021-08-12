import Ember from 'ember';
import * as _ from 'lodash';

export default Ember.Component.extend({
  email: '',
  message: '',
  name: '',
  collaborators: [],
  nameData: [],
  nameArray: [],
  emailData: [],
  emailArray: [],
  collaboratorObject: {},
  notification: {
    type: 0,
    msg: ''
  },

  projects: Ember.inject.service(),

  visiblityObserver: Ember.observer('active', function() {

    this.set('email', '');
    this.set('message', '');
    this.set('name', '');

  }),

  init() {
    this._super(...arguments);
    this.set('email', '');
    this.set('message', '');
    this.set('name', '');
  },

  didReceiveAttrs() {

  },

  isNotFilled: Ember.computed('name', 'email', 'message', function() {
    // var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    this.set('name', $('#uname').val());
    this.set('email', $('#uemail').val());
    var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;
    return (_.isEmpty(this.get('name')) || _.isEmpty(this.get('email')) || _.isEmpty(this.get('message')) || !emailPattern.test(this.get('email')));
  }),

  actions: {
    addCollaborator: function() {
      let project_collaborators = this.get('collaborators');
      let componentContext = this;
      $.ajax({
        type: 'GET',
        url: '/v1/collaborators?project_id=' + componentContext.get('project_id'),
        dataType: 'json',
        success: function(data) {
          let existingCollaborators = data.collaborators;
          if (!existingCollaborators.isAny('email', componentContext.get('email'))) {
            let collaborator = {};
            collaborator.name = componentContext.get('name');
            collaborator.email = componentContext.get('email');

            let c_array = [];
            c_array.pushObject(collaborator);
            componentContext.set('collaborators', c_array);

            let c_object = {};
            c_object.collaborators = componentContext.get('collaborators');
            c_object.message = componentContext.get('message');

            if (componentContext.get('document_id') == "null") {
              c_object.id = componentContext.get('project_id');
              c_object.isDoc = false;
            } else {
              c_object.id = componentContext.get('document_id');
              c_object.isDoc = true;
            }

            componentContext.set('collaboratorObject', c_object);

            let isDoc = false;

            componentContext.sendAction('inviteCollaborators', componentContext.get('collaboratorObject'));
            componentContext.set('active', false);
          } else {
            let existing_collaborator = existingCollaborators.find(x => x.email === componentContext.get('email'));
            if(existing_collaborator.status == 'pending') {
              let collaborator = {};
              collaborator.name = componentContext.get('name');
              collaborator.email = componentContext.get('email');

              let c_array = [];
              c_array.pushObject(collaborator);
              componentContext.set('collaborators', c_array);

              let c_object = {};
              c_object.collaborators = componentContext.get('collaborators');
              c_object.message = componentContext.get('message');

              if (componentContext.get('document_id') == "null") {
                c_object.id = componentContext.get('project_id');
                c_object.isDoc = false;
              } else {
                c_object.id = componentContext.get('document_id');
                c_object.isDoc = true;
              }

              componentContext.set('collaboratorObject', c_object);

              let isDoc = false;

              componentContext.sendAction('inviteCollaborators', componentContext.get('collaboratorObject'));
              componentContext.set('active', false);
            } else {
              componentContext.send('showNotification', "Collaborator already exists")
            }
          }
        },
        error: function(xhr, textStatus, errorThrown, data) {
          componentContext.send('showNotification', "Oops!, Seems like there is a technical glitch, Please try again");
        }
      })
    },

    showNotification(message) {
      let self = this;
      self.set('notification.type', 3);
      self.set('notification.msg', message);
      setTimeout(function() {
        self.set('notification.type', 0);
      }, 2000);
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

});
