import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin,{
  currentUser: Ember.inject.service('current-user'),
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

	model(params,transition){
  	return Ember.RSVP.hash({
      projectWorkflowSteps: Object.entries(this.store.queryRecord('project-workflow-step', {
        project_id: transition.params['app.projects.projecttab'].id,
      })),
  		userTasks: Object.entries(this.store.queryRecord('user-task', {
        project_id: transition.params['app.projects.projecttab'].id,
        response_status: ['accepted', 'rejected', 'completed', 'not_responded'],
      })),
  	});
  },
  actions: {
    acceptTask(task, cb) {
      const self = this;
      NProgress.start();
      Ember.$.ajax({
        url: `/v1/user_tasks/${task.get('id')}/accept_task`,
        method: 'PUT',
      })
      .done(() => {
        NProgress.done();
        self.refresh();
        cb();
      });
    },
    rejectTask(task, reason, cb) {
      NProgress.start();
      const self = this;
      Ember.$.ajax({
        url: `/v1/user_tasks/${task.get('id')}/reject_task`,
        method: 'PUT',
        data: {
          message: reason,
        }
      })
      .done(() => {
        NProgress.done();
        self.refresh();
        cb();
      });
    },
  }
});
