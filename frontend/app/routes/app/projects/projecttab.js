import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin,{

session: Ember.inject.service('session'),
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

model: function(params, transition) {
  return Ember.RSVP.hash({
    project: this.store.queryRecord('project', { id: transition.params['app.projects.projecttab'].id , basic: true, reload: true }),
  })
},

actions: {}

});
