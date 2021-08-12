import Ember from 'ember';
import bubble from '../../utils/bubble';
import { DOCUMENT_NEW, DOCUMENT_NEW_FROM_TEMPLATE } from '../../services/command-registry';
import { DOCUMENT_OPEN } from '../../services/command-registry';
import $ from 'jquery';


let inject = Ember.inject;

export default Ember.Component.extend({
	classNames: ['g-preview'],
	loading: true,
	cacheTag: '',
	router: Ember.inject.service(),
	session: Ember.inject.service(),
	commandRegistry: inject.service(),
	store: Ember.inject.service(),
	isOwner: true,
	comments: null,
	showDocs: false,
	currentUser: null,
	users: Ember.inject.service(),
  	time_zone: '',
	sortProps: ['created_at:desc'],
	sortedVersions: Ember.computed.sort('versions', 'sortProps'),
	notification: {
		type: 0,
		msg: ''
	},

	initCacheTag: function() {
		this.set('cacheTag', Date.now());
		this.set('showDocs', false);
	}.on('init'),

	didInsertElement: function() {
		Ember.run.scheduleOnce('afterRender', this, function() {
			this.setupLoadObserver();
		});
	},

	initSectionsProxy: function() {
		let session_data = this.get('session.session.content.authenticated');
		this.set('currentUser', session_data.user_id);
		if (this.document.section_containers) {
			this.set('sectionsProxy', this.document.get('section_containers').map(section => {
				return {
					selected: false,
					data: section
				}
			}));
		}
		const self = this;
		let doc = this.get('document');
		if (doc) {
			let created_by = doc.get('created_by');
			let assigned_to = doc.get('assigned_to');
			let session_data = self.get('session.session.content.authenticated');
			// if(assigned_to){
			//   if (session_data.user_id == created_by.id || session_data.user_id == assigned_to.id){
			//     this.set('isOwner', true);
			//   }
			// }else{
			//   this.set('isOwner', true);
			// }
			let store = self.get('store');
			if (doc.get('is_template') == false) {
				self.set('comments', store.query('comment', { document_id: doc.get('id') }));
			} else {
				self.set('comments', null);
			}
		}
		let ttime = self.get('users').getTimeZone();
    	self.set('time_zone', ttime);
    	// console.log(self.get('time_zone'));
	}.on('didReceiveAttrs'),

	setupLoadObserver: function() {
		let componentContext = this;
		let pdfPreview = $(this.element).find('.pdf-preview');
		pdfPreview.bind('DOMSubtreeModified', function() {
			Ember.run.later(componentContext, function() {
				this.set('loading', false);
			}, 1);
			pdfPreview.unbind('DOMSubtreeModified');
		});
	},

	isCommentNull: Ember.computed('docComment', function() {
		return (!this.get('docComment'));
	}),

	actions: {

		edit: function(id) {
			const self = this;
			let session_data = self.get('session.session.content.authenticated');
			let userID = session_data.user_id;
			let documentOwner = self.document.get('created_by');
			let documentAssigned = self.document.get('assigned_to');
			if (documentAssigned) {
				if (documentOwner.id == session_data.user_id || documentAssigned.id == session_data.user_id) {
					self.get('commandRegistry').execute(DOCUMENT_OPEN, self.get('document'));
				}
			} else {
				if (documentOwner.id == session_data.user_id) {
					self.get('router').transitionTo('app.documents.editor', self.get('document').id);
				}
			}
		},

		configureCoverPage: function(id) {
			this.get('router').transitionTo('app.documents.document-coverpage', id);
		},

		back: function() {
			history.back();
		},

		download() {
			window.open('/pdf_documents/' + this.document.id + '.pdf?' + this.get('cacheTag'));
		},

		redirectToProject: function(is_template) {
			if (is_template == true) {
				this.get('router').transitionTo('app.templates.documents');
			} else {
				this.get('router').transitionTo('app.projects.projecttab.document', this.get('document').belongsTo('project').id());
			}
		},

		writeComment(id) {
			NProgress.start();
			let store = this.get('store');
			const self = this;
			let comment = {};
			comment.comment = {};
			comment.comment.comment_text = self.get('docComment');
			$.ajax({
				async: false,
				url: "/v1/comments?document_id=" + id,
				method: 'POST',
				data: comment,
				success: function(response) {
					self.set('docComment', '');
					let documentComments = store.query('comment', { document_id: id });
					self.set('comments', documentComments);
					NProgress.done();
					self.send('showNotification', "Comment shared")
				},
				failure: function(error) {
					self.set('docComment', '');
					let documentComments = store.query('comment', { document_id: id });
					self.set('comments', documentComments);
					NProgress.done();
				}
			});
		},

		writeSectionComment(id) {
			let commentText = $('#section_comment_'+id).val();
			if(commentText){
				NProgress.start();
				let store = this.get('store');
				let doc = this.get('document');
				const self = this;
				let comment = {};
				comment.section_container_id = id;
				comment.comment = {};
				comment.comment.comment_text = $('#section_comment_'+id).val();
				$.ajax({
					async: false,
					url: "/v1/comments?",
					method: 'POST',
					data: comment,
					success: function(response) {
						self.set('sectionComment', '');
						$('#section_comment_'+id).val('');
						self.set('document', store.find('document', doc.get('id')));
						NProgress.done();
						self.send('showNotification', "Comment shared");
					},
					failure: function(error) {
						self.set('sectionComment', '');
						$('#section_comment_'+id).val('');
						self.set('document', store.find('document', doc.get('id')));
						NProgress.done();
					}
				});
			}else{
				this.send('showNotification', "Comment Text is empty");
			}
		},

		deleteComment(comment, id) {
			let session_data = this.get('session.session.content.authenticated');
			var user_id = session_data.user_id;
			if (user_id == id) {
				NProgress.start();
				let store = this.get('store');
				store.findRecord('comment', comment.id, { backgroundReload: false }).then(function(deletedComment) {
					deletedComment.destroyRecord();
				});
				NProgress.done();
				this.send('showNotification', "Comment was removed");
			} else {
				this.send('showNotification', "You do not have permission to delete this comment")
			}
		},

		deleteSectionComment(comment, id) {
			const self = this;
			let doc = self.get('document');
			let store = this.get('store');
			let session_data = this.get('session.session.content.authenticated');
			var user_id = session_data.user_id;
			if (user_id == id) {
				NProgress.start();
				$.ajax({
					type: "DELETE",
					url: "v1/comments/" + comment.id,
					success: function() {
						NProgress.done();
						self.set('document', store.find('document', doc.get('id')));
						self.send('showNotification', "Comment was removed");
					},
					failure: function() {
						NProgress.done();
						self.send('showNotification', "You do not have permission to delete this comment")
					}
				});
			} else {
				self.send('showNotification', "You do not have permission to delete this comment")
			}
		},

		showLinkedDcouments(documents) {
			this.set('linkedDocuments', documents);
			this.set('showDocs', true);
		},

		showNotification(message) {
			let self = this;
			self.set('notification.type', 3);
			self.set('notification.msg', message);
			setTimeout(function() {
				self.set('notification.type', 0);
			}, 2000);
		},

	}
});