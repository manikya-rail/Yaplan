import Ember from 'ember';
import bubble from '../../utils/bubble';
export default Ember.Component.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  users: Ember.inject.service(),
  router: Ember.inject.service('-routing'),
  onArchive: false,
  archive_this_Project: null,
  edit_this_Project: null,
  onEdit: false,
  isEdit: true,
  archivedProjects: null,
  sortProps: 'updatedAt',
  // page: 1,
  totalProjects: 0,
  totalPages: 0,
  pages: null,
  isLoading: false,
  users: Ember.inject.service(),
  time_zone: '',
  sessionData: '',
  projectInfo: null,
  showProjectInfo: false,
  // projects: Ember.computed.sort('projectsList', 'sortProps'),
  projects: Ember.computed.sort('projectsList', function(project1, project2) {
    let result = 0;
    let item1, item2;
    switch (this.get('sortProps')) {
      case 'updatedAt':
        item1 = project2.get('updatedAt');
        item2 = project1.get('updatedAt');
        break;
      case 'title':
        item1 = project1.get('title').trim().toLowerCase();
        item2 = project2.get('title').trim().toLowerCase();
        break;
      case 'category':
        item1 = this.get('categories').findBy(
          'id', project1.belongsTo('category').id()
        ).get('name').trim().toLowerCase();
        item2 = this.get('categories').findBy(
          'id', project2.belongsTo('category').id()
        ).get('name').trim().toLowerCase();
        break;
    }
    if (item1 < item2) {
      result = -1;
    } else if (item1 > item2) {
      result = 1;
    } else {
      result = 0;
    }
    return result;
  }),
  notification: {
    type: 0,
    msg: ''
  },
  actions: {
    onProjectClick(project) {
      this.sendAction('onProjectClick', project);
    },
    setSortProps(prop) {
      this.set('sortProps', prop);
      this.notifyPropertyChange('projects');
    },
    archiveProject(project) {
      let session_data = this.get('session.session.content.authenticated');
      let user_id = session_data.user_id;
      let created_by_id = project.get('created_by.id');
      const self = this;
      if (created_by_id == user_id) {
        self.set('archive_this_Project', project);
        self.set('onArchive', true);
      } else {
        self.send('showNotification', "Sorry, You do not have permission to archive this Project.");
      }
    },
    onArchiveProject(project) {
      const self = this;
      this.set('page', 1);
      NProgress.start();
      $.ajax({
        type: "DELETE",
        url: "v1/projects/" + project.id,
        success: function() {
          NProgress.done();
          self.set('onArchive', false);
          self.send('showNotification', 'Project Archived');
          self.sendAction('onArchiveProject', project);
        },
        failure: function() {
          NProgress.done();
          self.set('onArchive', false);
          self.send('showNotification', 'Sorry, There was a technical glitch in archiving a project');
          self.sendAction('onArchiveProject', project);
        }
      });
    },
    editProject(project) {
      let session_data = this.get('session.session.content.authenticated');
      let user_id = session_data.user_id;
      let created_by_id = project.get('created_by.id');
      const self = this;
      if (created_by_id == user_id) {
        self.sendAction('editProject', project);
      } else {
        self.send('showNotification', 'Sorry, You do not have permissions to do this action');
      }
    },
    goToArchiveProjects() {
      this.get('router').transitionTo('app.projects.archivedprojects');
    },
    showNotification(message) {
      let self = this;
      self.set('notification.type', 3);
      self.set('notification.msg', message);
      setTimeout(function() {
        self.set('notification.type', 0);
      }, 2000);
    },
    nextPage() {
      let page = this.get('page');
      this.set('page', page + 1);
      const self = this;
      let page_count = this.get('totalPages');
      if (page_count > 5) {
        let page_array = self.get('pages');
        let start = page_array[0] + 1;
        let count = 1;
        let pageArray = [];
        for (let i = start; i <= page_count; i++) {
          count++;
          if (count > 6) {
            break;
          } else {
            pageArray.push(i);
          }
        }
        self.set('pages', pageArray);
      }
      this.send('callNext', this.get('page'));
    },

    prevPage() {
      this.set('page', this.get('page') - 1);
      const self = this;
      let page_count = this.get('totalPages');
      let page_array = self.get('pages');
      let count = 1;
      if (page_array[0] != 1) {
        let pageArray = [];
        let start = page_array[0] - 1;
        for (let i = start; i <= page_count; i++) {
          count++;
          if (count > 6) {
            break;
          } else {
            pageArray.push(i);
          }
        }
        self.set('pages', pageArray);
      }
      this.send('callNext', this.get('page'));
    },

    // callProjects(pageNumber) {
    //   this.sendAction('callNextPage', pageNumber);
    // },

    callNext(pageNumber) {
      this.sendAction('callNextPage', pageNumber);
    },

    projectInfo(project) {
      this.set('projectInfo', project);
      this.set('showProjectInfo', true);
    }

  },
  didInsertElement: function() {
    this._super(...arguments);
    Ember.run.scheduleOnce('afterRender', this, function() {
    });
  },
  initFormFields: function() {
    this._super(...arguments);
    Ember.run.scheduleOnce('afterRender', this, function() {
      const self = this;
      $.ajax({
        type: "GET",
        url: "v1/projects/archived_count",
        dataType: "text",
        success: function(data) {
          if (data == 0) {
            self.set('archivedProjects', null);
          } else {
            self.set('archivedProjects', data);
          }
        }
      });

    });
    const self = this;
    if (this.get('page') == 1) {
      let meta = this.metaData.get('meta');
      self.set('totalProjects', meta.total_records);
      let totalRecords = meta.total_records;
      let no_of_pages = Math.ceil(totalRecords / 15);
      self.set('totalPages', no_of_pages);
      //limiting to 5 
      let pageArray = [];
      let count = 1;
      for (let i = 1; i <= no_of_pages; i++) {
        count++;
        if (count > 6) {
          break;
        } else {
          pageArray.push(i);
        }
      }
      self.set('pages', pageArray);
    }
   
    let ttime = self.get('users').getTimeZone();
    self.set('time_zone', ttime);
  }.on('didReceiveAttrs'),



});
