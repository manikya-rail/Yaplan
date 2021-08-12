import Ember from 'ember';

export default Ember.Component.extend({
	documents: Ember.inject.service(),
	session: Ember.inject.service(),

	isNotChanged: true,
	approverId: 0,
	candidates: [],

	visiblityObserver: Ember.observer('active', function(){
		let {active, approver} = this.getProperties('active', 'approver');
		let approver_id = this.get('document.approverId');
		let collaborators = this.get('document.collaborators');
		let session_data = this.get('session.session.content.authenticated');
		let candidates = [];

		this.set('approverId', approver_id);
		
		candidates.push({
			email: session_data.email,
			full_name: session_data.full_name,
			owner: true,
			id: session_data.user_id
		});

		for (var i in collaborators){
			if (collaborators[i].email)
				candidates.push(collaborators[i]);
		}

		this.set('candidates', candidates);
	}),

	actions: {
		select: function(id){
			this.set('isNotChanged', false);
			this.set('approverId', id);
		},
		close: function(){
			this.set('active', false);
			this.set('triggerFlag', false);
		},		
		save: function(){
			let componentContext = this;
			let documentObj = this.get('document');
			let approver_id = this.get('approverId');

			this.get('documents').changeApprover(documentObj, approver_id).then(function(){
				componentContext.set('document.approverId', approver_id);
				componentContext.set('active', false);

				componentContext.sendAction('approverChanged');
			});			
		}
	},

	didInsertElement: function() {
  		Ember.run.scheduleOnce('afterRender', this, function() {
	        this.$('.mCustomScrollbar').mCustomScrollbar();
	    });
	}
});