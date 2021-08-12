import Ember from 'ember';
import $ from 'jquery';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
let inject = Ember.inject;

export default Ember.Route.extend(AuthenticatedRouteMixin,{
  session: inject.service(),
  registration : Ember.inject.service(),
  beforeModel(transition) {
      let session_data = this.get('session.session.content.authenticated');
      var registrationservice = this.get('registration');
      let self = this;
    if(session_data.hasOwnProperty('email')){
    }else{
      registrationservice.set('PREVIOUSURL',transition);
      self.transitionTo('reg.login');
    }
  },

  model(params) {
    return Ember.RSVP.hash({
      // project : this.store.findAll('document'),
      document_id : params.id,
    });
  },

});
