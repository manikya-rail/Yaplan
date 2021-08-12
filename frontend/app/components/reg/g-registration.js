import Ember from 'ember';

export default Ember.Component.extend({
	identification: '',
	password: '',
	// full_name: '',
	first_name: '',
	last_name: '',
	passwordVisible: false,
	notification: {
		type: 0,
		msg: ""
	},
	processing: false,
	session: Ember.inject.service(),
	registration : Ember.inject.service(),

	isNotFilled : Ember.computed('identification', 'password', 'first_name', 'last_name', 'processing', function(){
		var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;
		return !(this.get('identification') && this.get('password') && this.get('first_name') && this.get('last_name')) || this.get('processing') || !emailPattern.test(this.get('identification'));
	}),

	actions: {
		/**
		 * Handles when user submits form
		 * @return {*}
		 */
		register(){
			let { identification, password, first_name, last_name } = this.getProperties('identification', 'password', 'first_name', 'last_name');
			this.set('notification', {
						type: 3,
						msg: "Processing your request..."
			});
			this.set('processing', true);

			this.get('registration').register(first_name, last_name, identification, password).then(res => {
				if(!res.success){
					var message = '';
					if(res.errors.email){
						message = "Email "+res.errors.email[0];
					}else if(res.errors.password){
						 message = "Password "+res.errors.password[0];
					}
					const self = this;
					this.set('notification', {
						type: 2,
						msg: message
					});
					setTimeout(function(){
						self.set('notification.type', 0);
					}, 2000);
					this.set('processing', false);
				}else{
					// Move to success page
					// this.$('body').trackRegister(res.payload.user_id, res.payload.full_name, res.payload.email);
					this.$('body').triggerRegisterFB();
					this.sendAction('opSucceeded', this.get('identification'));
				}
			});
		}
	},
	didInsertElement: function() {
		Ember.run.scheduleOnce('afterRender', this, function() {
				this.$('body').setupNaoInput();
		});
	}
});
