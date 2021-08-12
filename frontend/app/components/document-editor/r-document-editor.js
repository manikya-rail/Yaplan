import Ember from 'ember';
import $ from 'jquery';
import {DOCUMENT_SAVEAS_TEMPLATE} from '../../services/command-registry';
import bubble from '../../utils/bubble';
let inject = Ember.inject;

export default Ember.Component.extend({
	STATUS_SAVING: 'Saving...',
	STATUS_SAVED: 'All changes saved',

	optionsActive: false,

	documents: Ember.inject.service(),
	session: Ember.inject.service(),
	commandRegistry: Ember.inject.service(),
	router: Ember.inject.service(),
	store: Ember.inject.service(),
	users: Ember.inject.service(),
	time_zone: '',

	isChangeApproverOpened: false,
	isEditCollaboratorOpened: false,
	isAddCollaboratorOpened: false,
	isNoApproverOpened: false,
	isApprovalMessageOpened: false,
	triggerApprovalMessage: false,

	archive_document_id: '',

	routing: Ember.inject.service('-routing'),

	approvalNotify: {
		text: "",
		isOpen: false
	},

	notification: {
		type: 0,
		msg: ''
	},

	isOwner: false,
	approvalToaster: {},
	detailsPanelVisible: true,
	onArchive: false,

	setupToaster: function(){
		let approvalToaster = this.get('toaster').approvalToaster('Document is issued for approval');
		this.set('approvalToaster', approvalToaster);    
	},

	preProcess: function() {
		// change isOwner property according to the access level (owner/collaborator)
		let doc = this.get('document');
		const self = this;
		if (doc) {
			var store = this.get('store');
	
			if(doc.get('is_template') == false){
			 
			 this.set('comments',store.query('comment',{document_id:doc.id}));
		 
			}else{
				if(doc.get('is_public')){
					self.get('router').transitionTo('app.templates.documents');
				}else{
					self.set('comments',null);
				}
			}
			let created_by = doc.get('created_by');
			let session_data = this.get('session.session.content.authenticated');

			if (session_data && created_by && (session_data.user_id == created_by.id)){
				this.set('isOwner', true);
			}

			// approval notification bar on top
			if ((doc.get('state') == 1) && (session_data.user_id == doc.get('approverId'))){
				this.set('approvalNotify.text', 'Hi ' + (session_data.full_name?session_data.full_name:'') + ', the collaborators need your attention for this document');
				this.set('approvalNotify.isOpen', true);
			}else{
				this.set('approvalNotify.isOpen', false);
			}
		}
		let ttime = self.get('users').getTimeZone();
		self.set('time_zone', ttime);
		// console.log(self.get('time_zone'));
	}.on('didReceiveAttrs'),


	adjustLayout: function(){
		// menu collapsing logic based on screen size
		let componentContext = this;

		Ember.run.scheduleOnce('afterRender', this, function(){
			let screen_width = $('#app-route').width();
			if (screen_width >= 1600)
			{
				componentContext.set('detailsPanelVisible', false);
				// componentContext.showSideMenu(true);
			}else{
				componentContext.set('detailsPanelVisible', false);
				// componentContext.showSideMenu(false);
			}
		});
	}.on('didInsertElement'),

		postProcess: function(){
		 // menu show logic based on screen size
		let componentContext = this;

		Ember.run.scheduleOnce('afterRender', this, function(){
			let screen_width = $('#app-route').width();
			if (screen_width >= 1600)
			{
				componentContext.set('detailsPanelVisible', false);
				componentContext.showSideMenu(false);
			}else{
				componentContext.set('detailsPanelVisible', true);
				componentContext.showSideMenu(true);
			}
		});
	}.on('didDestroyElement'),


	issueApproval(){
		let componentContext = this;

		let approver_id = this.get('document.approverId');
		if (approver_id == this.get('session.session.content.authenticated.user_id'))
		{
			this.set('isNoApproverOpened', true);
		}else{
			this.set('isApprovalMessageOpened', true);
		}
	},

	showSideMenu: function(show){
		if (show){
			$('#sidebar').removeClass('collapsed-menu');
			$('#content-outer').removeClass('collapsed-menu');
		}else{
			$('#sidebar').addClass('collapsed-menu');
			$('#content-outer').addClass('collapsed-menu');
		}
	},

	actions: {
		editCollaborator(){
			this.set('isEditCollaboratorOpened', true);
		},

		setSavingState(){
			$('.status', this.element).html(this.STATUS_SAVING);
		},

		setSavedState(){
			$('.status', this.element).html(this.STATUS_SAVED);
		},

		importSection : bubble('importSection'),
		linkSection : bubble('linkSection'),
		preview : bubble('preview'),
		inviteCollaborators: bubble('inviteCollaborators'),

		/**
		 * Creates template from currently opened document
		 * @param doc
		 */
		 createTemplate(doc){
			this.get('commandRegistry').execute(DOCUMENT_SAVEAS_TEMPLATE, doc);
		},

		deleteDocument(doc){
			this.set('archive_document_id', doc);
			this.set('onArchive',true);
			// this.get('documents').deleteDocument(doc).then(() => {
			//   this.sendAction('documentDelete', doc.get('project_id'));
			// });
		},

		changeApprover(doc){
			this.set('isChangeApproverOpened', true);
		},

		issueApproval(doc){
			this.issueApproval();
		},

		requestApproval(msg){
			let componentContext = this;
			this.get('documents').changeState(this.get('document'), 1).then(function(){
				componentContext.get('document').reload();
				componentContext.set('approvalToaster.active', true);
			});
			this.get('documents').issueApproval(this.get('document'), msg).then(function(){
				// console.log('Approver notified');
			});
		},

		onNewCollaboratorModalTriggered: function(){
			this.set('isAddCollaboratorOpened', true);
		},

		onCollaboratorInvited: function(){
			this.get('document').reload();
		},

		onApproverChanged: function(){
			let triggerApprovalMessage = this.get('triggerApprovalMessage');

			if (triggerApprovalMessage){
				this.issueApproval();
				this.set('triggerApprovalMessage', false);
			}
		},

		rejectDocument: function(){
			let doc = this.get('document');
			let componentContext = this;

			this.get('documents').changeState(doc, 0).then(function(){
				componentContext.set('approvalNotify.isOpen', false);
				doc.reload();
			});
		},

		approveDocument: function(){
			//Optional action : Close "No Approver" modal
			this.set('isNoApproverOpened', false);

			let doc = this.get('document');
			let componentContext = this;

			this.get('documents').changeState(doc, 2).then(function(){
				componentContext.set('approvalNotify.isOpen', false);
				doc.reload();
			});
		},

		openApproverModal: function(){
			this.set('isNoApproverOpened', false);
			this.set('isChangeApproverOpened', true);
			this.set('triggerApprovalMessage', true);
		},

		redirectToProject: function(is_template){
			 if(is_template == true){
				this.get('router').transitionTo('app.templates.documents');
			}else{
			 // this.get('router').transitionTo('app.projects.projecttab.document', this.get('document.project'));
				 this.get('router').transitionTo('app.projects.projecttab.document', this.get('document').belongsTo('project').id());
			}
		},

		showNotification(message){
			let self = this;
			self.set('notification.type', 3);
			self.set('notification.msg', message);
			setTimeout(function(){
				self.set('notification.type', 0);
			}, 2000);
		},

		afterDelete(doc){
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
							url: "v1/documents/"+doc.id,
							success: function() {
								NProgress.done();
								self.set('notification.type', 3);
								self.set('notification.msg', "Document Archived");
								self.set('onArchive', false);
								setTimeout(function(){
									self.set('notification.type', 0);
									self.get('router').transitionTo('app.documents');
								}, 4000);
							},
							failure: function(){
								NProgress.done();
								self.set('notification.type', 3);
								self.set('notification.msg', "Sorry, There was a technical glitch in archiving a document");
								self.set('onArchive', false);
								setTimeout(function(){
									self.set('notification.type', 0);
									self.get('router').transitionTo('app.documents');
								}, 4000);
								}
						});
					} else {
						self.set('notification.type', 3);
						self.set('notification.msg', "Sorry, Document cannot be archived as it belongs to a project workflow");
						self.set('onArchive', false);
						setTimeout(function(){
							self.set('notification.type', 0);
							self.get('router').transitionTo('app.documents');
						}, 2000);
					}
				},
				error: function(xhr, textStatus, errorThrown, data) {
					if(xhr.status == 403) {
						NProgress.done();
						self.set('notification.type', 3);
						self.set('notification.msg', "Sorry, There was a technical glitch in archiving a document");
						self.set('onArchive', false);
						setTimeout(function(){
							self.set('notification.type', 0);
							self.get('router').transitionTo('app.documents');
						}, 2000);
					} else {
						NProgress.done();
						self.set('notification.type', 3);
						self.set('notification.msg', "Sorry, There was a technical glitch in archiving a document");
						self.set('onArchive', false);
						setTimeout(function(){
							self.set('notification.type', 0);
							self.get('router').transitionTo('app.documents');
						}, 2000);
					}
				},
				failure: function() {
					NProgress.done();
					self.set('notification.type', 3);
					self.set('notification.msg', "Sorry, There was a technical glitch in archiving a document");
					self.set('onArchive', false);
					setTimeout(function(){
						self.set('notification.type', 0);
						self.get('router').transitionTo('app.documents');
					}, 2000);
				}
			});
		},

		showMessage(message){
			const componentContext = this;
			componentContext.set('notification.type', 3);
						componentContext.set('notification.msg', message);
						setTimeout(function(){
							componentContext.set('notification.type', 0);
						}, 2000);
		}
	}
});
