import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  /**
   * All routes related to entire application
   */
  this.route('index', { path: '/index.html' });
  this.route('index', { path: '/landing' });
  this.route('index', { path: '/landing.html' });
  this.route('index', { path: '' });

  this.route('app', function() {
    this.route('import-section', function() {
      this.route('choose-doc', { path: 'choose-doc/:id/:type' });
      this.route('choose-section', { path: 'choose-section/:id/:type' });
    });

    //Plan Section
    this.route('plans', function() {
      this.route('new');
      this.route('plans');
    });
    // My documents section
    this.route('documents', function() {
      this.route('documents', { path: '' });
      this.route('templates');
      this.route('editor', { path: 'edit/:id' });
      this.route('preview', { path: 'preview/:id' });
      this.route('document_invitation', { path: ':id/accept_invitation' });
      this.route('document-rejection', { path: ':id/reject_invitation' });
      this.route('mine');
      this.route('document-view', { path: 'view/:id' });
      this.route('document-coverpage', { path: 'coverpage/:id' });
      this.route('document-version-view', { path: ':id/versions/:version_id' });
      this.route('version-diff', { path: ':id/versions/:version_id/diff' });
      this.route('archiveddocuments', { path: 'archived' });
    });

    // My projects section
    this.route('collaborators');
    this.route('projects', function() {
      this.route('projects', { path: 'project' });
      this.route('documents', { path: 'documents/:project_id' });
      this.route('templates', { path: 'templates/:project_id' });
      this.route('accept_invitation', { path: ':id/accept_invitation' });
      this.route('project_invitation', { path: ':id/accept_invitation' });
      this.route('reject_invitation', { path: ':id/reject_invitation' });
      this.route('project', { path: '' });
      this.route('projecttab', { path: '/:id' }, function() {
        this.route('collaborator', { path: 'collaborators' });
        this.route('document', { path: 'documents' }, function() {});
        this.route('task', { path: 'tasks' });
        this.route('workflow', { path: 'workflow' });
        this.route('archiveddocuments', { path: 'documents/archived' });
        this.route('workflow-editor', { path: 'workflow/edit' });
      });
      this.route('archivedprojects', { path: 'archivedProjects' });

    });


    this.route('dashboard', function() {
      this.route('dashboard', { path: '' });
      this.route('documents', { path: 'd/:id' });
      this.route('templates', { path: 't/:id' });
      this.route('editor', { path: 'edit/:id' });
      this.route('preview', { path: 'preview/:id' });
    });
    this.route('workflows', function() {
      this.route('index', { path: '' });
      this.route('templates');
    });

    /**
     * Routes for profile
     */
    this.route('settings', function() {
      this.route('profile', { path: '' });
      this.route('password');
      this.route('billing');
      this.route('plan');
    });

    this.route('templates', function() {
      this.route('documents');
      this.route('workflows', function() {
        this.route('index', { path: '' });
        this.route('new');
        this.route('edit', { path: ':id/edit' });
      });

      this.route('workflow', function() {});
      this.route('archived-doc-templates', {
        path: 'documents/archived'
      });
    });
    this.route('workflow-edit');

    this.route('admin', function() {
      this.route('category', { path: 'category' });
      this.route('archived-category', { path: 'archivedCategory' });
    });
    this.route('notification');

    this.route('projecttab', function() {
      this.route('document', function() {});
    });
    this.route('pagination');
  });
  /**
   * Routes related to registration and signing in
   */
  this.route('reg', function() {
    this.route('login');
    this.route('register');
    this.route('success', { path: 'success/:email' });
    this.route('forgot');
    this.route('password');
  });

  this.route('templates', function() {
    this.route('workflow', function() {});
  });
});

export default Router;