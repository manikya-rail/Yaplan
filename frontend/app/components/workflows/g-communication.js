import Ember from 'ember';
import * as _ from 'lodash';
export default Ember.Component.extend({
	store: Ember.inject.service('store'),
	showMelist: false,
	showEditMode: true,
	name: Ember.computed('step', function() {
		return this.get('step.node.data.text');
	}),
	communication: Ember.computed('step', function() {
		return this.get('step.communications.firstObject');
	}),
	attachments: Ember.computed('communication.attachments.@each', function() {
		let attachments = [];
		if (this.get('communication.attachments')) {
			this.get('communication.attachments').forEach(a => {
				let attachment = a.toJSON();
				attachments.push(attachment);
			});
		}
		return attachments;
	}),
	recepientEmails: Ember.computed('communication', function() {
		return _.clone(this.get('communication.recepientEmails') || []);
	}),
	didReceiveAttrs() {
		if(this.get('step.state') == 'approved' || this.get('step.state') == 'working' || this.get('step.state') == 'completed') {
	      this.set('showEditMode', false);
	    } else {
	      this.set('showEditMode', true);
	    }
		if (this.get('step') && this.get('active')) {
			this.$('input[name="subject"]').val(this.get('step.communications.firstObject.subject'));
			this.$('textarea[name="message"]').val(this.get('step.communications.firstObject.message'));
			this.$('select[name="communication_mode"]').val(this.get('step.communications.firstObject.communicationMode') || 'approved');
		}
		let emailArray = [];
		let usersArray = [];
		if(this.projectWorkflow) {
			let workflow_steps = this.get('projectWorkflow.projectWorkflowSteps');
			workflow_steps.forEach(function(key, value) {
				if(key.get('nodeType') == 'communication') {
					let communications = key.get('communications');
					if(communications) {
						communications.forEach(function(key1, value1) {
							let rec_emails = key1.get('recepientEmails');
							if(rec_emails) {
								rec_emails.forEach(function(key2, value2) {
									emailArray.push(key2);
								})
							}
						});
					}
				}
			});
		}
		if(this.users) { 
			let u_array = this.users;
			u_array.forEach(function(key, value) {
					usersArray.push(key.get('email'))
			});
		}
		if(emailArray) {
			let collaboratorArray = usersArray;
			emailArray.forEach(function(key, value) {
				if(usersArray.indexOf(key) == -1) {
					usersArray.push(key)
				}
			})
		}
		usersArray.sort();
		$("#new-email").autocomplete({
			source: usersArray,
			minLength: 0,
			appendTo: '#results',
		}).focus(function () {
			$(this).autocomplete("search");
		});
	},
	actions: {
		addEmail() {
			let emailList = [];
			emailList = this.get('recepientEmails');
			const email = this.$('#new-email').val();
			const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;
			if (emailPattern.test(email)) {
				if(emailList.indexOf(email) == -1){
					this.get('recepientEmails').pushObject(email);
					this.$('#new-email').val('');
				} else {
					alert('Email already exists');
					this.$('#new-email').val('');	
				}
			} else {
				alert('Please enter a valid email')
			}
		},
		removeEmail(index) {
			this.get('recepientEmails').removeAt(index);
		},
		updateCommunication() {
			const self = this;
			const communication = this.get('communication');
			communication.set('subject', this.$('input[name="subject"]').val());
			communication.set('message', this.$('textarea[name="message"]').val());
			communication.set('communicationMode', this.$('select[name="communication_mode"]').val())
			communication.set('recepientEmails', this.get('recepientEmails'));
			this.get('attachments').forEach(function(a, index) {
				let attachment = communication.get('attachments').objectAt(index);
				if (attachment) {
					if (a._destroy === true) {
						attachment.set('_destroy', true);
					}
				} else {
					attachment = communication.get('attachments').createRecord();
					attachment.set('fileAttachment', a.fileAttachment);
					attachment.set('_destroy', a._destroy);
				}
			});
			const step = this.get('step');
			step.set('node.data.text', this.$('input[name="name"]').val());
			if (this.get('step.communications').objectAt(0)) {
				this.get('step.communications').insertAt(0, communication);
			} else {
				this.get('step.communications').pushObject(communication);
			}
			this.sendAction(
				'updateCommunication',
				step, this.$('input[name="name"]').val()
			);
		},
		removeAttachment(index) {
			var attachment = this.get('attachments').objectAt(index);
			Ember.set(attachment, '_destroy', true);
		},
		cancelCommunication() {
			this.$("#new-attachment").val('');
			this.$("#new-email").val('');
			this.sendAction('cancelCommunication');
		},
		addAttachment() {
			const file = this.$('#new-attachment')[0].files[0];
			if (file) {
				const attachment = { fileAttachment: file };
				this.get('attachments').pushObject(attachment);
				this.$('#new-attachment').val('');
			} else {
				alert('Please select a file to upload');
			}
		},
		removeStep() {
			this.sendAction('removeStep', this.get('step'));
		},
	}
});
