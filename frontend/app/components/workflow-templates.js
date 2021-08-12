import Ember from 'ember';
import * as _ from 'lodash';
export default Ember.Component.extend({
	selectedCategory: 'all',
	totalTemplates: 0,
	totalPages: 0,
	pages: null,
	page: 1,
	templatesSorting: ['createdAt:desc'],
	sortedWorkflowTemplates: Ember.computed.sort('workflowTemplates', 'templatesSorting'),
	isGrid: true,
	currentUser: Ember.inject.service('current-user'),
	filteredWorkflowTemplates: Ember.computed(
		'selectedCategory', 'sortedWorkflowTemplates.@each', function() {
			if (this.get('selectedCategory') === 'all') {
				return this.get('sortedWorkflowTemplates');
			} else {
				return this.get('sortedWorkflowTemplates').filter(
					t => t.get('category.id') === this.get('selectedCategory')
				);
			}
		}
	),
	store: Ember.inject.service('store'),
	isAdmin: Ember.computed('currentUser.user', function() {
		return this.get('currentUser.user.role.name') === 'admin';
	}),
	didReceiveAttrs: function() {
		this._super(...arguments);
		Ember.run.scheduleOnce('afterRender', this, function() {
			const self = this;
			if(this.get('page') == 1) {
				let meta = self.workflowTemplates.get('meta');
				self.set('totalTemplates', meta.total_records);
				let totalRecords = meta.total_records;
				let no_of_pages =  Math.ceil(totalRecords/15);
				self.set('totalPages', no_of_pages);
				let pageArray = [];
				let count = 1;
				for(let i=1; i<=no_of_pages; i++){
					count++;
					if(count > 6) {
						break;
					} else {
						pageArray.push(i);
					}
				}
				self.set('pages', pageArray);
			}
		});
	},
	actions: {
		changeCategory() {
			this.set('selectedCategory', this.$('#workflow-category').val());
		},
		searchDocuments(evt) {
			const self = this;
			_.debounce(() => {
				if (self.get('projectWorkflow')) {
					self.set('page', 1);
					self.get('store').query(
					'project-workflow', { q: evt.target.value, page: 1 },
					).then((workflowTemplates) => {
						self.set('workflowTemplates', workflowTemplates);
					});
				} else {
					if(self.get('published')) {
						self.set('page', 1);
						self.get('store').query(
							'workflow-template', { q: evt.target.value, page: 1, published: true },
						).then((workflowTemplates) => {
							self.set('workflowTemplates', workflowTemplates);
						});
					} else {
						self.set('page', 1);
						self.get('store').query(
							'workflow-template', { q: evt.target.value, page: 1, all: true },
						).then((workflowTemplates) => {
							self.set('workflowTemplates', workflowTemplates);
						});
					}
				}
			}, 2000)();
		},
		nextPage() {
			let page = this.get('page');
			this.set('page', page + 1);
			const self = this;
			let page_count = this.get('totalPages');
			if(page_count > 5) {
				let page_array = self.get('pages');
				let start = page_array[0] + 1;
				let count = 1;
				let pageArray = [];
				for(let i=start; i<=page_count; i++){
					count++;
					if(count > 6) {
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
			if(page_array[0] != 1) {
				let pageArray = [];
				let start = page_array[0] - 1;
				for(let i=start; i<=page_count; i++){
					count++;
					if(count > 6) {
						break;
					} else {
						pageArray.push(i);
					}
				}
				self.set('pages', pageArray);
			}
			this.send('callNext', this.get('page'));
		},
		callNext(pageNumber) {
			let store = this.get('store');
			let self = this;
			NProgress.start();
			let query = $('#searchinput').val();
			if (self.get('projectWorkflow')) {
				store.query('project-workflow', { reload: true, page: pageNumber, q:query }).then(function(res) {
					self.set('page', pageNumber);
					self.set('workflowTemplates', res);
					NProgress.done();
				})
			} else {
				if(self.get('published')) {
					self.get('store').query(
						'workflow-template', {  reload: true, page: pageNumber, q:query, published: true },
					).then((workflowTemplates) => {
						self.set('workflowTemplates', workflowTemplates);
					});
				} else {
					store.query('workflow-template', { reload: true, page: pageNumber, q:query, all: true }).then(function(res) {
						self.set('page', pageNumber);
						self.set('workflowTemplates', res);
						NProgress.done();
					})
				}
			}
		},
	}
});
