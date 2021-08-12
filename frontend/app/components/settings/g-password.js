import Ember from 'ember';

export default Ember.Component.extend({
	oldPassword: '',
	newPassword: '',
	confirmPassword: '',
	passwordVisible: false,
	notifyType: 0,
	session: Ember.inject.service(),
	users: Ember.inject.service(),
	id: '',
	userName: '',
	imageurl: '',
	active : false,
	notification: {
    	type: 0,
    	msg: ""
  	},
	isNotFilled : Ember.computed('oldPassword', 'newPassword', 'confirmPassword', function(){
	    return !(this.get('oldPassword') && this.get('newPassword') && this.get('confirmPassword') == this.get('newPassword'));
	}),

	initFormFields: function(){
			let session_data = this.get('session.session.content.authenticated');
			this.set('id', session_data.user_id);
			// this.set('userName', session_data.full_name);
	}.on('didReceiveAttrs'),

	// didInsertElement: function() {
	//     Ember.run.scheduleOnce('afterRender', this, function() {
	//         this.$('body').setupNaoInput();
	//     });
	// },

	didInsertElement: function() {
		this._super(...arguments);
	    Ember.run.scheduleOnce('afterRender', this, function() {
	    	let session_data = this.get('session.session.content.authenticated');
			// console.log(session_data);
			let self = this;
			this.set('id', session_data.user_id);
	    	this.$('body').setupNaoInput();
			$.ajaxSetup({
			    headers : {
			        'X-User-email' :session_data.email,
			        'X-User-token' : session_data.token
			    }
			});
			
			$.ajax({
            	type: "GET",
            	url: "users/"+session_data.user_id,
            	success : function(data){
            		// self.set('userdata',data.user);	
            		self.set('userName',data.user.full_name);
            		if(data.user.portrait == null){
            			self.set('imageurl','assets/images/profile/default.png');
            		}else{
            			self.set('imageurl',data.user.portrait.image.url);
            		}
            	}
        	});

	    });

	},

	actions: {
		save(){
			let {oldPassword, newPassword} = this.getProperties('oldPassword', 'newPassword');
			let componentContext = this;

			this.get('users').resetPassword(oldPassword, newPassword).then(function( data, textStatus, jqXHR ) {
				componentContext.send('showNotification', "Password was reset Successfully");
				componentContext.set('oldPassword','');
				componentContext.set('newPassword','');
				componentContext.set('confirmPassword','');
			}, function( jqXHR, textStatus, errorThrown) {
				// console.log(jqXHR.responseJSON);
				var message = '';
          		if(jqXHR.responseJSON.errors.email){
            		message = "Email "+jqXHR.responseJSON.errors.email[0];
          		}else if(jqXHR.responseJSON.errors.password){
             		message = "Password "+jqXHR.responseJSON.errors.password[0];
          		}else if(jqXHR.responseJSON.errors.current_password){
          			message = "Current Password "+jqXHR.responseJSON.errors.current_password[0];
          		}
				// console.log(jqXHR);
				componentContext.set('notifyType', 2);
				componentContext.send('showNotification', message);
			});
		},

		cancel(){
			this.set('oldPassword','');
			this.set('newPassword','');
			this.set('confirmPassword','');
			this.set('active',false);
			this.set('notification.type', 0);
		},

		showNotification(message){
			let self = this;
			self.set('notification.type', 3);
			self.set('notification.msg', message);
			setTimeout(function(){
				self.set('notification.type', 0);
			}, 2000);
		},
	}
});