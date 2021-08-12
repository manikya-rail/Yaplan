import Ember from 'ember';
import updatequery from '../../../utils/updatequery';
var projectid;
export default Ember.Route.extend({
	/**
	 * Defines query parameters
	 */
	queryParams: {
		sortby: {
			refreshModel: true,
			replace: true
		},

		keyword: {
			refreshModel: true,
			replace: true
		},
	},
	withWorkflow: true,
	isinvitememberOpened: false,
	isAddProjectOpened: false,
	projectMetaData: null,
	/**
	 * Returns model associated with this route
	 .then(projects => projects.sortBy('created_at').reverse())
	 */
	model(params) {
		return Ember.RSVP.hash({
			projects: this.store.query('project', { reload: true, page: 1 }),
			params: params,
			categories: this.store.findAll('Category'),
			workflowTemplates: this.store.query('WorkflowTemplate', {
				published: true,
			}),
		})
	},

	afterModel(model){
		this.set('projectMetaData', model.projects.get('meta'));
		// console.log(this.get('projectMetaData'));
		// console.log(model);
		// let meta = model.projects;
		// console.log(meta);
		// console.log(model.projects.get('meta'));
	},

	isaddcategorymodal: true,

	actions: {

		changeKeyword: updatequery('keyword'),
		changeSortBy: updatequery('sortby', v => v ? v.id : undefined),

		/**
		 * When user clicks project - transition to the project menu page
		 * @param project
		 */
		onProjectClick(project) {
			// this.transitionTo('app.dashboard.documents', project.id);
			// this.transitionTo('app.projects.projecttab', project.id);
			this.transitionTo('app.projects.projecttab.workflow', project.id);
		},

		onArchiveProject(project) {
			this.refresh();
		},

		/**
		 * Handles when new project was created
		 */
		onProjectCreated() {
			this.refresh();
		},

		refreshPage() {
			this.refresh();
		},


		addProject() {
			this.set('isAddProjectOpened', true);
		},
		createproject(project, cb) {
			NProgress.start();
			const self = this;
			NProgress.start();
			const newProject = !project.id;
			project.save().then(function(saveddata) {
				NProgress.done();
				projectid = saveddata.get('id');
				if (newProject) {
					NProgress.done();
					return cb(false, true);
				} else {
					NProgress.done();
					return cb(false, false);
				}
			});
		},

		createcategory() {
			this.set('isaddcategorymodal', true);
		},
		invitelistofmemeber(collaborators) {
			if (collaborators == null) {
				this.refresh();
			} else {
				collaborators.project_id = projectid;
				let invitationss = {};
				invitationss.collaborators = [];
				invitationss.collaborators = collaborators.collaborators;
				invitationss.message = collaborators.message;
				invitationss.project_id = projectid;
				let store = this.get('store');
				let projectinvitation = store.createRecord('invitations');
				projectinvitation.setProperties({
					message: invitationss.message,
					project_id: invitationss.project_id,
					collaborators: invitationss.collaborators

				});
				const self = this;
				projectinvitation.save().then(function(saveddata) {
					// console.log(saveddata);
					self.refresh();

				}).catch((adapterError) => {
					self.refresh();

				});
			}
		},
		searchProjects(query, cb) {
			const self = this;
			self.store.query('project', { q: query, page: 1 }).then(projects => {
				self.set('currentModel.projects', projects);
			});
		}
	}
});
