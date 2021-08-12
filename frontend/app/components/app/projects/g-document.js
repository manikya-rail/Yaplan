import Ember from 'ember';
import updatequery from '../../../utils/updatequery';
import { DOCUMENT_NEW, DOCUMENT_NEW_FROM_TEMPLATE } from '../../../services/command-registry';
import { DOCUMENT_OPEN } from '../../../services/command-registry';
import { DOCUMENT_SAVEAS_TEMPLATE } from '../../../services/command-registry';

let inject = Ember.inject;

export default Ember.Component.extend({
	commandRegistry: inject.service(),
	isAddCollaboratorOpened: false,
	store: Ember.inject.service(),
	users: Ember.inject.service(),
  	time_zone: '',
	onArchive: false,
	document_id: "null",
	archive_document_id: '',
	router: Ember.inject.service('-routing'),
	collaborators: null,
	documentinformation: null,
	showDocuments: true,
	linkedDocuments:null,
	showArchivedDocuments: false,
	infoDoc: false,
	count: 0,
	showText: true,
	showLoadingText: false,
	onUpdate: false,
	totalDocuments: 0,
	totalPages: 0,
	createDoc: false,
	pages: null,
	page: 1,
	categories: null,
	sortProps: 'updatedAt',
	workflowsAssociated: null,
	sortedDocs: Ember.computed.sort('documents', function(doc1, doc2) {
		let result = 0;
		let item1, item2;
		switch (this.get('sortProps')) {
			case 'updatedAt':
				item1 = doc2.get('updatedAt');
				item2 = doc1.get('updatedAt');
				break;
			case 'title':
				item1 = doc1.get('title').toLowerCase();
				item2 = doc2.get('title').toLowerCase();
				break;
			case 'category':
				item1 = doc1.get('category_name').toLowerCase();
				item2 = doc2.get('category_name').toLowerCase();
				break;
			case 'project':
				item1 = doc1.get('project.title').toLowerCase();
				item2 = doc2.get('project.title').toLowerCase();
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
	allProjects: null, 
	showDocs: false,
	notification: {
		type: 0,
		msg: ''
	},
	isTile: true,
	isList: false,
	onAssignProject: false,

	initFormFields: function() {
		this._super(...arguments);
		Ember.run.scheduleOnce('afterRender', this, function() {
			// if (this.projectID) {
				let self = this;
				self.send('getArchivedDocumentsCount');
			// }
		});
	}.on('didInsertElement'),

	didReceiveAttrs: function() {
		this._super(...arguments);
		Ember.run.scheduleOnce('afterRender', this, function() {
			const self = this;
			if(this.get('page') == 1) {
				let meta = self.documents.get('meta');
				self.set('totalDocuments', meta.total_records);
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
		});
	},

	actions: {
		clickDocument(doc) {
			// this.get('commandRegistry').execute(DOCUMENT_OPEN, doc);
			this.get('router').transitionTo('app.documents.document-view', doc.id);
		},

		saveAsTemplate(document) {
			this.get('commandRegistry').execute(DOCUMENT_SAVEAS_TEMPLATE, document);
		},

		createDocument() {
			this.set('createDoc', true);
			this.set('updateTemplate', null);
			this.set('onUpdate', true);
		},

		setDocumentId(docID, projectID) {
			this.set('document_id', docID);
			const self = this;
			$.ajax({
				type: 'GET',
				url: '/v1/collaborators?document_id=' + docID,
				dataType: 'json',
				success: function(data) {
					self.set('collaborators', data.collaborators);
					self.toggleProperty('isAddCollaboratorOpened');
				}
			});
		},

		archiveDoc(doc) {
			this.set('archive_document_id', doc);
			this.set('onArchive', true);
		},
		setSortProps(prop) {
			this.set('sortProps', prop);
			this.notifyPropertyChange('documents');
		},
		showNotification(message) {
			let self = this;
			self.set('notification.type', 3);
			self.set('notification.msg', message);
			setTimeout(function() {
				self.set('notification.type', 0);
			}, 2000);
		},

		inviteCollaborators(collaboratorObject) {
			let store = this.get('store');
			let self = this;
			if (!collaboratorObject.isDoc) {
				let ProjectInvitation = store.createRecord('invitations');
				ProjectInvitation.setProperties({
					message: collaboratorObject.message,
					project_id: collaboratorObject.id,
					collaborators: collaboratorObject.collaborators
				});
				ProjectInvitation.save().then(function(saveddata) {
					// console.log(saveddata);
				});
			} else if (collaboratorObject.isDoc) {
				let DocumentInvitation = store.createRecord('invitations');
				DocumentInvitation.setProperties({
					message: collaboratorObject.message,
					document_id: collaboratorObject.id,
					collaborators: collaboratorObject.collaborators
				});
				DocumentInvitation.save().then(function(saveddata) {
					self.send('showNotification', 'Collaborators for the document invited Successfully');
				}).catch(function(error) {
					self.send('showNotification', 'Collaborators for the document invited Successfully');
				});
			}
		},

		goToArchivedDocs(pid) {
			// this.toggleProperty('showArchivedDocuments');
			// this.toggleProperty('showDocuments');  
			if(this.projectID) {
				this.get('router').transitionTo('app.projects.projecttab.archiveddocuments', this.projectID);
			} else {
				this.send('showArchivedDocs');
			}
		},

		showArchivedDocs() {
			this.get('router').transitionTo('app.documents.archiveddocuments');
		},

		showDocumentInfo(doc) {
			const self = this;
			let store = self.get('store');
			NProgress.start()
			self.set('workflowsAssociated', store.query('project-workflow', { document_id: doc.get('id') }, { reload: true }));
			NProgress.done();
			this.set('documentinformation', doc);
			this.toggleProperty('infoDoc');
		},

		isListdata() {
			this.toggleProperty('isTile');
			this.toggleProperty('isList');
		},


		isTiledata() {
			this.toggleProperty('isTile');
			this.toggleProperty('isList');
		},

		refreshPage() {
			let store = this.get('store');
			const self = this;
			this.set('page', 1);
			if (this.get('scope') === 'project') {
				NProgress.start();
				self.sendAction('refreshPage');
				self.send('getArchivedDocumentsCount');
			} else {
				NProgress.start();
				this.sendAction('refreshPage');
				self.send('getArchivedDocumentsCount');
				NProgress.done();
			}
		},

		restoreDocument(id, project, doc) {
			let self = this;
			let store = this.get('store');
			$.ajax({
				type: "PUT",
				url: "v1/documents/" + id + "/unarchive",
				dataType: "text",
			}).done(function(data, statusText, xhr) {
				let status = xhr.status;
				if (status == '200') {
					let pid = project.id;
					self.set('documents', null);
					self.set('documents', store.query('document', { project_id: pid }, { reload: true }));
					self.toggleProperty('showArchivedDocuments');
					self.toggleProperty('showDocuments');
					self.sendAction('refreshPage');
				}
			});
		},

		searchDocuments(event) {
			const self = this;
			self.set('showText', false);
			self.set('showLoadingText', true);
			let store = this.get('store');
			let query = { q: event.target.value };
			self.set('page', 1);
			if (self.projectID) {
				query.project_id = self.projectID
			}
			query.page = 1;
			store.query('document', query).then(docs => {
				self.set('showLoadingText', false);
				self.set('documents', docs);
			});
		},

		showProjects() {
			const self = this;
			let store = self.get('store');
			NProgress.start();
			$.ajax({
				type: 'GET',
				url: '/v1/projects/list?',
				success: function(data) {
					self.set('allProjects', data.projects);
					store.query('category', { reload: true }).then(function(res){
						NProgress.done();
						self.set('categories', res);
						self.set('createDoc', true);
						self.set('updateTemplate', null);
						self.set('onUpdate', true);
					});
					// self.set('onAssignProject', true);
				}
			});
		},

		goToCollaboratorsTab(pid) {
			this.get('router').transitionTo('app.projects.projecttab.collaborator', pid);
		},

		deleteDoc(doc) {
			const self = this;
			NProgress.start();
			let project_workflows = null;
			$.ajax({
				type: "GET",
				url: "v1/project_workflows?document_id=" + doc.id,
				success: function(data) {
					NProgress.done();
					console.log(data.project_workflows);
					if(data.project_workflows.length == 0) {
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
							error: function(xhr, textStatus, errorThrown, data) {
								if(xhr.status == 403) {
									NProgress.done();
									self.set('onArchive', false);
									self.send('showNotification', 'Sorry, You do not have permissions to archive this document');
									self.send('refreshPage');
								} else {
									NProgress.done();
									self.set('onArchive', false);
									self.send('showNotification', 'Sorry, There was a technical glitch in archiving a document');
									self.send('refreshPage');
								}
							},
							failure: function() {
								NProgress.done();
								self.set('onArchive', false);
								self.send('showNotification', 'Sorry, There was a technical glitch in archiving a document');
								self.send('refreshPage');
							}
						});
					} else {
						self.send('showNotification', 'Sorry, Document cannot be archived as it belongs to a project workflow');
						self.set('onArchive', false);
					}
				},
				error: function(xhr, textStatus, errorThrown, data) {
					if(xhr.status == 403) {
						NProgress.done();
						self.set('onArchive', false);
						self.send('showNotification', 'Sorry, There was a technical glitch in archiving a document');
						self.send('refreshPage');
					} else {
						NProgress.done();
						self.set('onArchive', false);
						self.send('showNotification', 'Sorry, There was a technical glitch in archiving a document');
						self.send('refreshPage');
					}
				},
				failure: function() {
					NProgress.done();
					self.set('onArchive', false);
					self.send('showNotification', 'Sorry, There was a technical glitch in archiving a document');
					self.send('refreshPage');
				}
			});
		},

		updateAttributes(doc) {
			this.set('updateTemplate', doc);
			this.set('onUpdate', true);
		},

		getArchivedDocumentsCount() {
			NProgress.start();
			let self = this;
			if(self.projectID) {
				$.ajax({
					type: "GET",
					url: "v1/documents/archived_count?project_id=" + self.projectID,
					dataType: "text",
					success: function(data) {
						NProgress.done();
						if (data == 0) {
							self.set('archivedDocuments', null);
						} else {
							self.set('archivedDocuments', data);
						}
					},
					error: function() {}
				});
			} else {
				$.ajax({
					type: "GET",
					url: "v1/documents/archived_count",
					dataType: "text",
					success: function(data) {
						NProgress.done();
						if (data == 0) {
							self.set('archivedDocuments', null);
						} else {
							self.set('archivedDocuments', data);
						}
					},
					error: function() {}
				});
			}
		},

		showLinkedDcouments(documents) {
			this.set('linkedDocuments', documents);
			this.set('showDocs', true);
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
			let query = $('#searchinput').val();
			NProgress.start();
			if (self.projectID) {
				store.query('document', { reload: true, page: pageNumber, q: query, project_id: self.projectID }).then(function(res) {
					self.set('page', pageNumber);
					self.set('documents', res);
					NProgress.done();
				})
			} else {
				store.query('document', { reload: true, page: pageNumber, q: query }).then(function(res) {
					self.set('page', pageNumber);
					self.set('documents', res);
					NProgress.done();
				})
			}
		},

	}
});