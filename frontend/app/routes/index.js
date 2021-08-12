import Ember from 'ember';

import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

// * Replace with this code when "Logout" is implemented
export default Ember.Route.extend({
  session: Ember.inject.service('session'),
  beforeModel() {
    if (this.get('session.isAuthenticated')) {
      this.transitionTo('reg.login');
    } else {
      this.transitionTo('app.dashboard');
    }
  }
});


// export default Ember.Route.extend({
// });
