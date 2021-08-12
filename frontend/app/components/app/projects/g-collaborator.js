import Ember from 'ember';
import $ from 'jquery';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  showMessage: true,
  showMembers: true,
  showInvites: false,
  isAddCollaboratorOpened: false,
  members: null,
  invites: null,
  collaborators: null,
  notification: {
    type: 0,
    msg: ''
  },

  onShowAssignedDocuments: false,
  documentsAssigned: null,
  // members: Ember.computed.filter('collaborations', function(collaboration) {
  //   return collaboration.get('is_accepted');
  // }),
  // invites: Ember.computed.filter('collaborations', function(collaboration) {
  //   return !collaboration.get('is_accepted');
  // }),

  initNaoInput: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      let pid = this.get('pid');
      let self = this;
      self.send('getProjectCollaborators');
    });
  }.on('didReceiveAttrs'),

  isPending: function(status) {
    // console.log(status);
  },

  actions: {
    isMember: function() {

      this.toggleProperty('showMembers');
      this.toggleProperty('showInvites');
    },
    
    isInvitee: function() {
      this.toggleProperty('showInvites');
      this.toggleProperty('showMembers');
    },

    addCollaborator: function(ownerID) {
      let session_data = this.get('session.session.content.authenticated');
      const self = this;
      if(ownerID == session_data.user_id){
        self.toggleProperty('isAddCollaboratorOpened');
      }else{
        self.send('showNotification', "You can not invite collaborators for this project, Only project owners can do the action")
      }
    },

    showNotification(message){
      let self = this;
      self.set('notification.type', 3);
      self.set('notification.msg', message);
      setTimeout(function(){
        self.set('notification.type', 0);
      }, 2000);
    },

    inviteCollaborators: function(collaboratorObject, cb) {
      if (collaboratorObject.isDoc == false) {
        this.set('showMessage', true);
        NProgress.start();
        var store = this.get('store');
        var ProjectInvitation = store.createRecord('invitations');
        const self = this;
        ProjectInvitation.setProperties({
          message: collaboratorObject.message,
          project_id: collaboratorObject.id,
          collaborators: collaboratorObject.collaborators
        });
        ProjectInvitation.save().then(function(saveddata) {
          self.sendAction('reloadCollaborations');
          NProgress.done();
          self.set('showMessage', false);
          self.send('showNotification','Collaborators for the project invited Successfully');
        }).catch(function(response){
          self.sendAction('reloadCollaborations');
          NProgress.done();
          self.set('showMessage', false);
          self.send('showNotification','Collaborators for the project invited Successfully');
          // self.send('getProjectCollaborators');
        });
      } else {
        this.set('showMessage', true);
        NProgress.start();
        var store = this.get('store');
        const self = this;
        var ProjectInvitation = store.createRecord('invitations');
        ProjectInvitation.setProperties({
          message: collaboratorObject.message,
          document_id: collaboratorObject.id,
          collaborators: collaboratorObject.collaborators
        });
        ProjectInvitation.save().then(function(saveddata) {
          self.sendAction('reloadCollaborations');
          NProgress.done();
          self.set('showMessage', false);
        }).catch(function(response){
          NProgress.done();
          self.set('showMessage', false);
          self.send('showNotification','Collaborators for the project invited Successfully');
          self.send('getProjectCollaborators');
        });
      }
    },

    showDocuments(assignedDocuments){
      this.set('documentsAssigned', assignedDocuments);
      this.set('onShowAssignedDocuments', true);
    },

    getProjectCollaborators(){
      const self = this;
      let pid = self.get('pid');
      $.ajax({
        type: 'GET',
        url: '/v1/projects/' + pid + '/collaborators',
        dataType: 'json',
        success: function(data) {
          self.set('collaborators', data.collaborations);
          self.set('showMessage', false);
        }
        });
    }


  }

});
