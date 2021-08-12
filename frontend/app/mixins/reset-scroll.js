import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
export default Ember.Mixin.create(ApplicationRouteMixin, {
  actions: {
    didTransition: function() {
      this._super();
      window.scrollTo(0,0);
    }
  }
});
