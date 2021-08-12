import Ember from 'ember';
import $ from 'jquery';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ResetScroll from '../mixins/reset-scroll'
let inject = Ember.inject;

export default Ember.Route.extend(ResetScroll, {
  username: '',
  currentUser: Ember.inject.service('current-user'),
  userInformation: null,
  session: inject.service(),
  users: inject.service(),
  store: Ember.inject.service(),
  activeRoute: 'dashboard',

  actions: {
    updateUserProfile() {
      var store = this.get('store');
      let session_data = this.get('session.session.content.authenticated');
      this.set('userInformation',store.find('user',session_data.user_id))
    },
  }
});
