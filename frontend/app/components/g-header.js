import Ember from 'ember';
import $ from 'jquery';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import bubble from '../utils/bubble';
import Cookie from 'ember-simple-auth/session-stores/cookie';
window.Cookie = Cookie;
let inject = Ember.inject;

export default Ember.Component.extend(AuthenticatedRouteMixin, {
	session: inject.service(),
	users: inject.service(),
	store: Ember.inject.service(),
	router: Ember.inject.service(),
	id: '',
	name: '',
	email: '',
	notification : null,
	userInformation : null,
	username : null,
	imageurl : null,
	loadingText: true,
	toast: {
		type: 0,
		msg: ''
	},

	initFormFields: function() {
	
		let session_data = this.get('session.session.content.authenticated');
		this.set('id', session_data.user_id);
		this.set('email', session_data.email);
		let self = this;
		const store = self.get('store');
		// this.set('notification', store.query('activity', {reload: true}));
		this.set('userInformation', store.find('user',session_data.user_id));
	}.on('didReceiveAttrs'),

	actions: {

		toggleMenu: function() {
			let collapsed = $('#sidebar').hasClass('collapsed-menu');
			if (collapsed) {
				$('#sidebar').removeClass('collapsed-menu');
				$('#content-outer').removeClass('collapsed-menu');
			} else {
				$('#sidebar').addClass('collapsed-menu');
				$('#content-outer').addClass('collapsed-menu');
			}
		},
		updateProfile : bubble('updateProfile'),

		settings: function(){
			this.get('router').transitionTo('app.settings');
		},

		/**
		 * Log out user by invalidating session
		 */
		logout() {
			const promise = this.get('users').signoutTest();
			promise.then(() => {
				this.get('session').invalidate();
				setTimeout(() => {
					Cookies.set('ember_simple_auth-session-expiration_time', null);
				}, 500);

			});
		},

		dropDown() {
			$('.dropdown-toggle').click(function() {
				$('.p-dropdown').toggle();
			});

			$(document).click(function(e) {
				var target = e.target;
				if (!$(target).is('.dropdown-toggle') && !$(target).parents().is('.dropdown-toggle')) {
					$('.dropdown').hide();
				}
			});
		},

		goToDashboard() {
			this.get('router').transitionTo('app.dashboard');
		},

		openURL(){
			window.open("https://www.yakkaplan.com/help");
		},

		acceptProjectInvitation(id){
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
					// self.transitionTo('app.dashboard');
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
				self.set('notification', store.query('activity', { reload: true, page: 1 }));
			}, 2000);
		},

		toggleNotification(){
			const self = this;
			self.toggleProperty('isNoficationActive');
			if(self.get('isNoficationActive')){
				self.set('loadingText', true);
				const store = self.get('store');
				store.query("activity", { reload: true, page: 1 }).then(function(res) {
    				self.set('notification', res);
    				self.set('loadingText', false);
				});
			}
		}


	}
});
