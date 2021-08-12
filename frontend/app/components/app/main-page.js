import Ember from 'ember';
let inject = Ember.inject;

export default Ember.Component.extend({
	
  currentUser: Ember.inject.service('current-user'),
  session: inject.service(),
  store: Ember.inject.service(),
  userInformation : null,

  initFormFields: function() {
  
    let session_data = this.get('session.session.content.authenticated');
    this.set('id', session_data.user_id);
    this.set('email', session_data.email);
    let self = this;
    const store = self.get('store');
    this.set('userInformation', store.find('user',session_data.user_id));

  }.on('didReceiveAttrs'),

  actions: {
    updateUserProfile() {
      this.sendAction('updateUserProfile');
    },

  }
});
