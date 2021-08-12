import Ember from 'ember';
import ResetScroll from '../mixins/reset-scroll';

const { service } = Ember.inject;

// import nprogress from 'ember-cli-nprogress';
export default Ember.Route.extend(ResetScroll, {
  currentUser: service(),
  segment: service(),
  beforeModel() {
    return this._loadCurrentUser();
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentUser();
  },

  _loadCurrentUser() {
    return this.get('currentUser').load().catch(() => this.get('session').invalidate());
  },
  identifyUser() {
    if (this.get('currentUser.user')) {
      this.get('segment').identifyUser(
        this.get('currentUser.user.id'), {
          email: this.get('currentUser.user.email'),
          full_name: this.get('currentUser.user.full_name'),
        },
      );
    }
  },
  actions: {
    loading(transition) {
      NProgress.start();
      transition.finally(() => {
        NProgress.done();
      });
      return true;
    },
    didTransition: function() {
      this._super.apply(this, arguments); // Call super at the beginning
      // Your stuff
    },
  },
});
