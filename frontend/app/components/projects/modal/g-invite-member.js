import Ember from 'ember';

export default Ember.Component.extend({

  collaboratorslist: [],
  collaborators: [],
  collaboratorsobject: {},
  projects: Ember.inject.service(),
  router: Ember.inject.service(),
  session: Ember.inject.service(),
  message: '',
  invitename: '',
  inviteemail: '',
  invitemessage: '',
  nameData: [],
  nameArray: [],
  emailData: [],
  emailArray: [],
  disableAddButton: true,

  notification: {
    type: 0,
    msg: ''
  },


  model: function() {
    return collaboration;
  },

  visiblityObserver: Ember.observer('active', function() {

    this.set('inviteemail', '');
    this.set('invitename', '');

  }),

  isNotFilled: Ember.computed('invitename', 'inviteemail', function() {
    // var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    this.set('invitename', $('#uname').val());
    this.set('inviteemail', $('#uemail').val());
    var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;
    return (_.isEmpty(this.get('invitename')) || _.isEmpty(this.get('inviteemail')) || !emailPattern.test(this.get('inviteemail')));
  }),

  isSend: Ember.computed('invitemessage', function() {
    var array = this.get('collaborators');
    var arrayLength = array.get('length');
    return (!this.get('invitemessage') || !(arrayLength > 0))
  }),

  isClicked: false,

  initFormFields: function() {
    this.set('collaborators', []);
    this.set('invitemessage', '');
    this.set('isClicked', false);
  }.on('didReceiveAttrs'),

  init() {
    this._super(...arguments);
    this.set('collaborators', []);
    this.set('invitemessage', '');
    this.set('isClicked', false);
    this.set('invitename', '');
    this.set('inviteemail', '');
  },

  nameObserver: function() {
    var array = this.get('collaborators');
    var arrayLength = array.get('length');
    if (!this.get('invitemessage') || !(arrayLength > 0)) {
      this.set('isSend', true);
    } else {
      this.set('isSend', false);
    }
  }.observes('invitemessage'),


  /**
   * Returns if we are creating new project rather then editing existing
   * @return {boolean}
   */
  isCreateMode: function() {
    return !this.project;
  },
  actions: {
    hiderow: function() {
      this.set('invitename', '');
      this.set('inviteemail', '');
      this.toggleProperty('isClicked');
    },

    addcollaborator: function() {
      let this_pointer = this;
      let collaborator = {};
      let session_data = this_pointer.get('session.session.content.authenticated');

      collaborator.name = this_pointer.get('invitename');
      collaborator.email = this_pointer.get('inviteemail');
      let collaboratorarray = this_pointer.get('collaborators');
      if (!collaboratorarray.isAny('email', collaborator.email) && !(this_pointer.get('inviteemail') == session_data.email)) {
        if ((this_pointer.get('inviteemail') == session_data.email)) {
          this_pointer.set('notification.type', 3);
          this_pointer.set('notification.msg', 'You are the Owner of the project');
          setTimeout(function() {
            this_pointer.set('notification.type', 0);
          }, 2000);
        } else {
          NProgress.start();
          $.ajax({
            type: "GET",
            url: "/v1/collaborators/get_user?email=" + this_pointer.get('inviteemail'),
            success: function(data) {
              // console.log(data);
              if (data.user) {
                collaborator.name = data.user.full_name;
              }
              collaboratorarray.pushObject(collaborator);
              NProgress.done();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
              NProgress.done();
              collaboratorarray.pushObject(collaborator);
            }
          });
        }
      } else {
        this_pointer.set('notification.type', 3);
        this_pointer.set('notification.msg', 'Collaborator already exists.');
        setTimeout(function() {
          this_pointer.set('notification.type', 0);
        }, 2000);
      }
      // collaboratorarray.pushObject(collaborator);
      this_pointer.set('collaborators', collaboratorarray.reverse());
      this_pointer.toggleProperty('isClicked');
      this_pointer.set('invitename', '');
      this_pointer.set('inviteemail', '');
      $('#invitemessage').focus();
    },

    isMessage() {
      var array = this.get('collaborators');
      var arrayLength = array.get('length');
      if (!this.get('invitemessage') || !(arrayLength > 0)) {
        this.set('isSend', true);
      } else {
        this.set('isSend', false);
      }
    },

    sendinvitation: function(customMessage) {
      var invitemessage = this.get('invitemessage');
      this.collaboratorsobject.message = invitemessage;
      this.collaboratorsobject.collaborators = this.get('collaborators');
      this.sendAction('invitelistofmemeber', this.collaboratorsobject);
      if (this.get('customMessage')) {
        this.sendAction('showNotification', customMessage);
      } else {
        this.sendAction('showNotification', "Project has been created Successfully");
      }
      this.set('active', false);
    },

    deleteCollaborator: function(collaborator) {
      let temp = this.get('collaborators');
      temp.removeObject(collaborator);
      this.set('collaborators', temp);
      this.send('isMessage');
    },

    cancelInvite: function() {
      this.set('collaboratorsobject', null);
      this.sendAction('invitelistofmemeber', this.collaboratorsobject);
      if (!this.get('customMessage')) {
        this.sendAction('showNotification', 'Project has been created Successfully');
      }
      this.set('active', false);
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
          componentContext.set('invitename', ui.item.value);
          let a = componentContext.get('nameArray');
          let i = a.indexOf(ui.item.value);
          let b = componentContext.get('nameData');
          let val = b[i];
          $('#uemail').val(val.email);
          componentContext.set('inviteemail', val.email);
          $('#uname').blur();
          return false;
        },
      }).focus(function() {
        $(this).autocomplete("search");
      });

      if (componentContext.get('nameArray').length == 0) {
        componentContext.set('invitename', $('#uname').val());
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
              // console.log('in else null')
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
          componentContext.set('inviteemail', ui.item.value);
          let a = componentContext.get('emailArray');
          let i = a.indexOf(ui.item.value);
          let b = componentContext.get('emailData');
          let val = b[i];
          $('#uname').val(val.full_name);
          componentContext.set('invitename', val.full_name);
          $('#uemail').blur();
          return false;
        },
      }).focus(function() {
        $(this).autocomplete("search");
      });

      if (componentContext.get('emailArray').length == 0) {
        componentContext.set('inviteemail', $('#uemail').val());
      }

      if ($('#uemail').val().length == 0) {
        $('#uemail').autocomplete("destroy");
      }
    },
  }
});
