import Ember from 'ember';
import { DOCUMENT_NEW_FROM_TEMPLATE } from '../../services/command-registry';
import { DOCUMENT_NEW, TEMPLATE_NEW } from '../../services/command-registry';
import { DOCUMENT_OPEN } from '../../services/command-registry';

export default Ember.Component.extend({
	List: true,
	users: Ember.inject.service(),
  	time_zone: '',
	onDocumentEdit: false,
	editDocument: null,
	categoryID: null,
	isShow: true,
	isCreate: false,
	onCreateTemplate: false,
	allProjects: null,
	commandRegistry: Ember.inject.service(),
	router: Ember.inject.service(),
	store: Ember.inject.service(),
	session: Ember.inject.service(),
	isTile: true,
	isList: false,
	showText: true,
	showLoadingText: false,
	user_id: null,
	workflowsAssociated: null,
	showDocuments: true,
	showArchivedDocuments: false,
	totalTemplates: 0,
	totalPages: 0,
	pages: null,
	page: 1,
	currentUser: Ember.inject.service('current-user'),
	notification: {
		type: 0,
		msg: ''
	},
	isAdmin: Ember.computed('currentUser.user.role.name', function() {
		return this.get('currentUser.user.role.name') === 'admin';
	}),

	documentInformation: null,
	onShowDocumentInformation: false,
	selectedCategory: 'all',
	templatesSorting: ['createdAt:desc'],
	sortProps: 'updatedAt',
	sortedTemplates: Ember.computed.sort('documentTemplates', function(doc1, doc2) {
		let result = 0;
		let item1, item2;
		switch (this.get('sortProps')) {
			case 'updatedAt':
				item1 = doc2.get('updatedAt');
				item2 = doc1.get('updatedAt');
				break;
			case 'title':
				item1 = doc1.get('title').trim().toLowerCase();
				item2 = doc2.get('title').trim().toLowerCase();
				break;
			case 'category':
				item1 = doc1.get('category_name').trim().toLowerCase();
				item2 = doc2.get('category_name').trim().toLowerCase();
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
	templates: Ember.computed('selectedCategory', 'sortedTemplates.@each', function() {
		if (this.get('selectedCategory') === 'all') {
			return this.get('sortedTemplates');
		} else {
			return this.get('sortedTemplates').filter(
				t => t.get('project.categoryId') === parseInt(this.get('selectedCategory'))
			);
		}
	}),
	archive_document_id: null,
	onArchive: false,
	setupEditDocModal: function() {
		let session_data = this.get('session.session.content.authenticated');
		this.set('user_id', session_data.user_id);
		this.set('onDocumentEdit', false);
	}.on('init'),
	onAssignProject: false,
	assignTemplate: null,
	onUpdate: false,
	updateTemplate: null,

	didReceiveAttrs: function() {
		this._super(...arguments);
		Ember.run.scheduleOnce('afterRender', this, function() {
			const self = this;
			if(this.get('page') == 1) {
				let meta = self.documentTemplates.get('meta');
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
			let ttime = self.get('users').getTimeZone();
    		self.set('time_zone', ttime);
    		// console.log(self.get('time_zone'));
		});
	},

	actions: {
		clickTemplate(template) {
			this.sendAction('clickTemplate', template);
		},

		exportDocument(template) {
			// this.get('router').transitionTo('app.documents.preview', template.id);
			window.open('/pdf_documents/' + template.id + '.pdf?' + this.get('cacheTag'));
		},

		previewDocument(template) {
			this.get('router').transitionTo('app.documents.preview', template.id);
		},

		renameDocument(template) {
			this.set('editDocument', template);
			this.set('onDocumentEdit', true);
		},

		editDocumentName(doc) {
			this.sendAction('editDocumentName', doc);
			this.set('onDocumentEdit', false);
		},

		create() {
			const self = this;
			let store = self.get('store');
			NProgress.start();
			store.query('category', { reload: true }).then(function(res){
				self.set('categories', res);
				NProgress.done();
				self.toggleProperty('onCreateTemplate');
			})
		},

		changeCategory() {
			this.set('selectedCategory', this.$('#filter-template-category').val());
			if (this.get('selectedCategory') !== 'all') {
				var store = this.get('store');
				this.set('templates', store.query('document-template', { category_id: this.get('selectedCategory') }))
			} else {
				var store = this.get('store');
				this.set('templates', store.findAll('document-template'))
			}
		},

		isListdata() {
			this.toggleProperty('isTile');
			this.toggleProperty('isList');
		},

		isTiledata() {
			this.toggleProperty('isTile');
			this.toggleProperty('isList');
		},

		showDocumentInformation(template) {
			const self = this;
			let store = self.get('store');
			NProgress.start();
			self.set('workflowsAssociated', store.query('workflow-template', { document_template_id: template.get('id') }, { reload: true }));
			NProgress.done();
			self.set('documentInformation', template);
			self.toggleProperty('onShowDocumentInformation');
		},

		assignProject(template) {
			const self = this;
			let store = self.get('store');
			NProgress.start();
			// store.query('project', { reload: true, list: true }).then(function(res){
			//   self.set('allProjects', res);
			//   NProgress.done();
			//   self.set('assignTemplate', template);
			//   self.toggleProperty('onAssignProject');
			// })
			$.ajax({
				type: 'GET',
				url: '/v1/projects/list?',
				success: function(data) {
					self.set('allProjects', data.projects);
					NProgress.done();
					self.set('assignTemplate', template);
					self.toggleProperty('onAssignProject');
				}
			});
		},
		setSortProps(prop) {
			this.set('sortProps', prop);
			this.notifyPropertyChange('documentTemplates');
		},
		updateTemplateAttributes(template) {
			// console.log(template);
			this.set('page', 1);
			this.set('updateTemplate', template);
			// console.log(this.get('updateTemplate'));
			this.toggleProperty('onUpdate');
		},

		archiveDoc(doc) {
			this.set('archive_document_id', doc);
			this.set('onArchive', true);
		},

		deleteDoc(doc) {
			const self = this;
			NProgress.start();
			const store = this.get('store');
			store.query('workflow-template', { document_template_id: doc.get('id') }, { reload: true }).then((t) => {
				NProgress.done();
				if (t.get('length')) {
					self.set('onArchive', false);
					self.send("showNotification", "Sorry, There are Workflow Templates associated with this Document Template");
				} else {
					self.set('page', 1);
					NProgress.start();
					$.ajax({
						type: "DELETE",
						url: "v1/documents/" + doc.id,
						success: function() {
							NProgress.done();
							self.set('onArchive', false);
							self.send('showNotification', 'Document Archived');
							self.send('refreshPage');
						},
						failure: function() {
							NProgress.done();
							self.set('onArchive', false);
							self.send('showNotification', 'Sorry, There was a technical glitch in archiving a document');
							self.send('refreshPage');
						}
					});
				}
			});
		},
		refreshPage() {
			this.sendAction('refreshPage');
		},
		searchDocuments(evt) {
			const self = this;
			this.set('showText', false);
			this.set('showLoadingText', true);
			this.set('page', 1);
			const query = { q: evt.target.value, page: 1 };
			if (this.get('archived')) {
				query.archived = true;
			}
			this.get('store').query(
				'document-template', query
			).then((templates) => {
				self.set('showLoadingText', false);
				self.set('documentTemplates', templates);
			});
		},

		publishTemplate(template) {
			NProgress.start();
			const self = this;
			let store = self.get('store');
			store.findRecord("document", template.get('id'), { reload: true }).then(function(document) {
				document.set("is_public", true),
					document.save().then(() => {
						self.send("showNotification", "Document Template published Successfully");
						self.send('refreshPage');
						NProgress.done();
					});
			});
		},

		unPublishTemplate(template) {
			const self = this;
			let store = self.get('store');
			NProgress.start();
			store.query('workflow-template', { document_template_id: template.get('id') }, { reload: true }).then((t) => {
				self.set('workflowsAssociated', t);
				NProgress.done();
				if (self.get('workflowsAssociated.length')) {
					self.send("showNotification", "Sorry, There are Workflow Templates associated with this Document Template");
				} else {
					NProgress.start();
					store.findRecord("document", template.get('id'), { reload: true }).then(function(document) {
						document.set("is_public", false),
							document.save().then(() => {
								self.send("showNotification", "Document Template Unpublished!");
								self.send('refreshPage');
								NProgress.done();
							});
					});
				}
			})
		},
		restoreDocument(id) {
			let self = this;
			let store = this.get('store');
			NProgress.start();
			$.ajax({
				type: "PUT",
				url: "v1/documents/" + id + "/unarchive",
				dataType: "text",
			}).done(function(data, statusText, xhr) {
				let status = xhr.status;
				NProgress.done();
				if (status == '200') {
					self.send('showNotification', 'The document template has been restored');
					self.sendAction('refreshPage');
				}
			});
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
			store.query('document-template', { reload: true, page: pageNumber, q: query }).then(function(res) {
				self.set('page', pageNumber);
				self.set('documentTemplates', res);
				NProgress.done();
			})
		},
	}
});
