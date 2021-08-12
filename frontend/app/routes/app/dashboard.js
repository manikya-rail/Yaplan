import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model(params) {
    return Ember.RSVP.hash({
      activities: this.store.query('activity', { backgroundReload: true, page: 1 }),
      invitations: this.store.query('activity', { type: 'pending_invitations' }),
      userProjects: this.store.query('project', { backgroundReload: true, request_from: 'dashbord' }),
      userTasks: this.store.query('user-task', { response_status: 'not_responded' }),
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
    acceptInvite(invite, cb) {
      NProgress.start();
      const self = this;
      console.log(self);
      const projOrDoc = invite.get('trackableType') === 'Project' ? 'projects' : 'documents';
      Ember.$.ajax({
        type: "GET",
        url: `/v1/${projOrDoc}/${invite.get('trackable.id')}/accept_invitation`,
        success: function(data) {
          NProgress.done();
          self.refresh();
          cb(true);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          NProgress.done();
          self.refresh();
          cb(XMLHttpRequest.responseJSON);
        },
      });
    },
    rejectInvite(invite, cb) {
      NProgress.start();
      const self = this;
      console.log(self);
      const projOrDoc = invite.get('trackableType') === 'Project' ? 'projects' : 'documents';
      Ember.$.ajax({
        type: "GET",
        url: `/v1/${projOrDoc}/${invite.get('trackable.id')}/reject_invitation`,
        success: function(data) {
          NProgress.done();
          cb(true);
          self.refresh();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          NProgress.done();
          cb(XMLHttpRequest.responseJSON);
          self.refresh();
        },
      });
    },
    searchProjects(query, cb) {
      const self = this;
      this.store.query('project', { q: query, type: 'include_invited' }).then(projects => {
        cb(projects);
      });
    }
  }
});
