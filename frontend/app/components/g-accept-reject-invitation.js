import Ember from 'ember';
import $ from 'jquery';
let inject = Ember.inject;

export default Ember.Component.extend({
	router: Ember.inject.service(),
	session: Ember.inject.service(),
	notification: {
		type: 0,
		msg: ''
	},
	url: null,

	acceptRejectInvitation: function() {
		let session_data = this.get('session.session.content.authenticated');
		let self = this;
		$.ajaxSetup({
			headers: {
				'X-User-email': session_data.email,
				'X-User-token': session_data.token
			}
		});

		if(self.project) {
			if(self.accept) {
				self.set('url', "/v1/projects/"+self.project_id+"/accept_invitation");
				self.send('makeRequest', 'project', 'accept');
			} else {
				self.set('url', "/v1/projects/"+self.project_id+"/reject_invitation");
				self.send('makeRequest', 'project', 'reject');
			}
		} else {
			if(self.accept) {
				self.set('url', "/v1/documents/"+self.document_id+"/accept_invitation");
				self.send('makeRequest', 'document', 'accept');
			} else {
				self.set('url', "/v1/documents/"+self.document_id+"/reject_invitation");
				self.send('makeRequest', 'document', 'reject');
			}
		}
	}.on('didReceiveAttrs'),

	actions: {
		makeRequest(invitation, type) {
			let session_data = this.get('session.session.content.authenticated');
			let self = this;
			$.ajaxSetup({
				headers: {
					'X-User-email': session_data.email,
					'X-User-token': session_data.token
				}
			});

			$.ajax({
				type: "GET",
				url: self.get('url'),
				success: function(data) {
					if( invitation == 'project' ) {
						if( type == 'accept' ) {
							self.send('showNotification', "You accepted the Project Collaboration Request");
						} else {
							self.send('showNotification', "You rejected the Project Collaboration Request");
						}
					} else {
						if( type == 'accept' ) {
							self.send('showNotification', "You accepted the Document Collaboration Request");
						} else {
							self.send('showNotification', "You rejected the Document Collaboration Request");
						}
					}
				},
				error: function(xhr, textStatus, errorThrown, data) {
					let errorResponse = xhr.responseJSON;
					let errorMessage = errorResponse.error;
					if(xhr.status == 500) {
						self.send('showNotification', "Oops!, Seems like there is a technical glitch, Please try again");
					} else {
						self.send('showNotification', errorMessage);
					}
				}
			});
		},

		showNotification(message) {
			let self = this;

			self.set('notification.type', 3);
			self.set('notification.msg', message);
			setTimeout(function() {
				self.set('notification.type', 0);
				self.get('router').transitionTo('app.dashboard');
			}, 2000);
		},

	}


});
