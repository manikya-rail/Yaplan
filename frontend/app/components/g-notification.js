import Ember from 'ember';
import $ from 'jquery';
let inject = Ember.inject;

export default Ember.Component.extend({

	store: Ember.inject.service(),
	session: Ember.inject.service(),
	loadingText: false,
	totalNotifications: 0,
	totalPages: 0,
	pages: null,
	page: 1,
	toast: {
		type: 0,
		msg: ''
	},

	didReceiveAttrs: function() {
		this._super(...arguments);
		Ember.run.scheduleOnce('afterRender', this, function() {
			const self = this;
			if(this.get('page') == 1) {
				let meta = self.notifications.get('meta');
				self.set('totalNotifications', meta.total_records);
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
		acceptProjectInvitation(id){
			NProgress.start();
			let self = this;
			let session_data = this.get('session.session.content.authenticated');
			$.ajaxSetup({
				headers: {
					'X-User-email': session_data.email,
					'X-User-token': session_data.token
				}
			});
			$.ajax({
			type: "GET",
			url: "/v1/projects/"+id+"/accept_invitation",
			success: function(data) {
				self.set('page', 1);
				// self.transitionTo('app.dashboard');
				NProgress.done();
				var message = 'You have accepted the Project invitation';
				self.send('showNotification', message);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				var errormessage = 'You are not allowed to do this action';
				self.send('showNotification', errormessage);
			}
			});
		},

		rejectProjectInvitation(id){
			NProgress.start();
			let self = this;
			let session_data = this.get('session.session.content.authenticated');
			$.ajaxSetup({
				headers: {
					'X-User-email': session_data.email,
					'X-User-token': session_data.token
				}
			});
			$.ajax({
			type: "GET",
			url: "/v1/projects/"+id+"/reject_invitation",
			success: function(data) {
				NProgress.done();
				self.set('page', 1);
				// self.transitionTo('app.dashboard');
				self.send('showNotification', 'You have rejected the Project invitation');
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				var errormessage = 'You are not allowed to do this action';
				self.send('showNotification', errormessage);
			}
			});
		},

		acceptDocumentInvitation(id){
			NProgress.start();
			let self = this;
			let session_data = this.get('session.session.content.authenticated');
			$.ajaxSetup({
				headers: {
					'X-User-email': session_data.email,
					'X-User-token': session_data.token
				}
			});
			$.ajax({
				type: "GET",
				url: "/v1/documents/"+id+"/accept_invitation",
				success: function(data) {
					NProgress.done();
					self.set('page', 1);
					// self.transitionTo('app.dashboard')
					var message = 'You have accepted the Document invitation';
					self.send('showNotification', message);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					var errormessage = 'You are not allowed to do this action';
					self.send('showNotification', errormessage);
				}
			});
		},

		rejectDocumentInvitation(id){
			NProgress.start();
			let self = this;
			let session_data = this.get('session.session.content.authenticated');
			$.ajaxSetup({
				headers: {
					'X-User-email': session_data.email,
					'X-User-token': session_data.token
				}
			});
			$.ajax({
			type: "GET",
			url: "/v1/documents/"+id+"/reject_invitation",
			success: function(data) {
				NProgress.done();
				self.set('page', 1);
				// self.transitionTo('app.dashboard')
				var message = 'You have rejected the Document invitation';
				self.send('showNotification', message);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				var errormessage = 'You are not allowed to do this action';
				self.send('showNotification', errormessage);
			}
			});
		},

		showNotification(message){
			let self = this;
			self.set('toast.type', 3);
			self.set('toast.msg', message);
			setTimeout(function(){
			self.set('toast.type', 0);
			const store = self.get('store');
			NProgress.start();
			self.set('loadingText', true);
			store.query("activity", { reload: true, page: 1 }).then(function(res) {
	    		self.set('notifications', res);
	    		self.set('loadingText', false);
	    		NProgress.done();
			});
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
			store.query('activity', { reload: true, page: pageNumber }).then(function(res) {
				self.set('page', pageNumber);
				self.set('notifications', res);
				NProgress.done();
			})
		},
	}

});
