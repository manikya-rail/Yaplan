import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import $ from 'jquery';
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
      // project : this.store.findAll('project'),
      project_id : params.id,
    });
  },

});
