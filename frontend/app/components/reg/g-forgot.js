import Ember from 'ember';
import bubble from '../../utils/bubble';

export default Ember.Component.extend({
	identification: '',
	notifyType: 0,
	notifyMsg: '',
	emailSent: false,

	users: Ember.inject.service(),

	isNotFilled : Ember.computed('identification', function(){
		return !this.get('identification');
	}),

	bubbleContinue: bubble('onContinue'),

	actions: {
		remind(){
			let emailSent = this.get('emailSent');
			let email = this.get('identification');
			let componentContext = this;

			if (emailSent){
				this.bubbleContinue();
			}else {
				this.get('users').requestPasswordReset(email).then(function( data, textStatus, jqXHR ) {
					componentContext.set('notifyType', 100);
					componentContext.set('notifyMsg', 'Password resetter email has been sent.');
					componentContext.set('emailSent', true);
				}, function( jqXHR, textStatus, errorThrown ) {
					componentContext.set('notifyType', 2);
					componentContext.set('notifyMsg', 'Account does not exist.');
				});
			}
		}
	},

	didInsertElement: function(){
		Ember.run.scheduleOnce('afterRender', this, function() {
        	this.$('body').setupNaoInput();
    	});
	}
});