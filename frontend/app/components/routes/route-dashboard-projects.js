import Ember from 'ember';
import bubble from '../../utils/bubble';
export default Ember.Component.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  billings: Ember.inject.service(),
  classNames: ['dashboard-projects-route'],
  isaddcategorymodal: true,
  planToaster: {},
  store: Ember.inject.service(),
  withWorkflow: false,
  step1: true,
  isinvitememberOpened: false,
  isAddProjectOpened: false,
  showText: true,
  page: 1,
  projectIds: 'all',
  projectModalButtonsDisabled: false,
  sortProperties: ['createdAt:desc'],
  sortedProjects: Ember.computed.sort('projects', 'sortProperties'),
  filteredProjects: Ember.computed('projectIds', 'sortedProjects.@each', function() {
    if (this.get('projectIds') === 'all') {
      return this.get('sortedProjects');
    } else {
      return this.get('sortedProjects').filter(
        project => _.includes(
          this.get('projectIds'), (project.get('id') || '').toString()
        ) && !project.get('archived')
      );
    }
  }),
  project: Ember.computed('store', function() {
    return this.get('store').createRecord('project');
  }),
  notification: {
    type: 0,
    msg: ''
  },

  isTile : true,
  isList : false,

  setupToaster: function() {
    let planToaster = this.get('toaster').planToaster('Please upgrade your plan', 'app.settings.billing', 'Upgrade', 'Remind me later');
    this.set('planToaster', planToaster);
  }.on('init'),

  didInsertElement: function() {
    let componentContext = this;
    let promise = this.get('billings').getCurrentSubscription();

    promise.then((plan) => {
      // console.log("Current plan : " + plan.plan_id);
      if (!plan.masked_card)
        Ember.run.later(function() {
          componentContext.set('planToaster.active', true);
        }, 1000);
    });
  },
  actions: {
    onProjectClick: bubble('onProjectClick'),
    changeSortBy: bubble('changeSortBy'),
    changeKeyword: bubble('changeKeyword'),
    onArchiveProject: bubble('onArchiveProject'),
    refreshPage: bubble('refreshPage'),
    addProject() {
      this.set('project', this.get('store').createRecord('project'));
      this.set('step1', true);
      this.set('isAddProjectOpened', true);
    },
    onInviteMember() {
      this.set('isinvitememberOpened', true);
    },
    editProject(project) {
      this.set('withWorkflow', false);
      this.set('step1', true);
      this.set('isAddProjectOpened', true);
      this.set('project', project);
    },
    onProjectCreated() {
      this.set('project', this.get('store').createRecord('project'));
      this.sendAction('onProjectCreated');
    },
    createproject(project) {
      this.set('page', 1);
      const self = this;
      self.set('projectModalButtonsDisabled', true);
      this.sendAction(
        'createproject',
        project,
        function(isAddProjectOpened, isinvitememberOpened) {
          self.set('isAddProjectOpened', isAddProjectOpened);
          self.set('isinvitememberOpened', isinvitememberOpened);
          self.set('projectModalButtonsDisabled', false);
          self.sendAction('onProjectCreated');
        }
      )
    },
    invitelistofmemeber: bubble('invitelistofmemeber'),

    showNotification(message){
      const self = this;
      self.set('notification.type', 3);
      self.set('notification.msg', message);
      setTimeout(function(){
        self.set('notification.type', 0);
      }, 2000);
    },

    isListdata(){
      this.toggleProperty('isTile');
      this.toggleProperty('isList');
    },

    isTiledata(){
      this.toggleProperty('isTile');
      this.toggleProperty('isList');
    },
    searchProjects(event) {
      this.set('page', 1);
      this.set('showText', false);
      const self = this;
      if(event.target.value === '') {
        self.set('projectIds', 'all');
      } else {
        setTimeout(function(){
          // console.log(event.target.value);
          self.sendAction('searchProjects', event.target.value, function(projects) {
            self.set('projectIds', projects.map(project => project.get('id')));
          });
        },2000);
      }
    },

    callNextPage(pageNumber) {
      let store = this.get('store');
      let self = this;
      NProgress.start();
      let query = $('#searchinput').val();
      store.query('project', { reload: true, page: pageNumber, q: query }).then(function(res) {
        self.set('page', pageNumber);
        self.set('projects', res);
        NProgress.done();
      })
    }
  }
});
