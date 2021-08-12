import Ember from 'ember';
import * as _ from 'lodash';
export default Ember.Component.extend({
  projectIds: 'all',
  classNames: ['flex-rows'],
  sortProperties: ['createdAt:desc'],
  allTasks: Ember.computed.union('userTasks', 'invitations'),
  sortedTasks: Ember.computed.sort('allTasks', 'sortProperties'),
  users: Ember.inject.service(),
  time_zone: '',
  didReceiveAttrs: function() {
    this._super(...arguments);
    Ember.run.scheduleOnce('afterRender', this, function() {
      const self = this;
      let ttime = self.get('users').getTimeZone();
      self.set('time_zone', ttime);
      // console.log(ttime);
    });
  },
  filteredUserTasks: Ember.computed(
    'sortedTasks.@each.task.state', 'sortedTasks.@each', 'projectIds', function() {
      if (this.get('projectIds') === 'all') {
        return this.get('sortedTasks');
      } else {
        return this.get('sortedTasks').filter(
          userTask => {
            if (userTask.get('constructor.modelName') === 'activity') {
              const model = userTask;
              return (
                (model.get('trackableType') === 'Project' &&
                  _.includes(this.get('projectIds'), (model.get('trackable.id') || "").toString())) ||
                  (model.get('recipientType') === 'Project' &&
                    _.includes(this.get('projectIds'), (model.get('trackable.id') || "").toString()))
              );
            } else {
              return _.includes(
                this.get('projectIds'), userTask.get('task.project.id')
              )
            }
          }
        );
      }
    }
  ),
  sortedProjects: Ember.computed.sort('userProjects', 'sortProperties'),
  filteredProjects: Ember.computed('projectIds', 'sortedProjects.@each', function() {
    if (this.get('projectIds') === 'all') {
      return this.get('sortedProjects');
    } else {
      return this.get('sortedProjects').filter(
        project => _.includes(
          this.get('projectIds'), project.get('id').toString()
        )
      );
    }
  }),
  sortedActivities: Ember.computed.sort('activities', 'sortProperties'),
  filteredActivities: Ember.computed('sortedActivities.@each', 'projectIds', function() {
    if (this.get('projectIds') === 'all') {
      return this.get('sortedActivities');
    } else {
      return this.get('sortedActivities').filter(model => (
        (model.get('trackableType') === 'Project' &&
          _.includes(this.get('projectIds'), (model.get('trackable.id') || "").toString())) ||
          (model.get('recipientType') === 'Project' &&
            _.includes(this.get('projectIds'), (model.get('trackable.id') || "").toString()))
      ));
    }
  }),
  actions: {
    changeProject() {
      this.set('selectedProject', this.$('#dashboard-project-filter').val());
    },
    acceptTask(task, cb) {
      this.sendAction('acceptTask', task, cb);
    },
    rejectTask(task, reason, cb) {
      this.sendAction('rejectTask', task, reason, cb);
    },
    searchProjects(event) {
      const self = this;
      if(event.target.value === '') {
        self.set('projectIds', 'all');
      } else {
        this.sendAction('searchProjects', event.target.value, function(projects) {
          self.set('projectIds', projects.map(project => project.get('id')));
        });
      }
    },
    acceptInvite(invite, cb) {
      this.sendAction('acceptInvite', invite, cb);
    },
    rejectInvite(invite, cb) {
      this.sendAction('rejectInvite', invite, cb);
    },
  }
});
