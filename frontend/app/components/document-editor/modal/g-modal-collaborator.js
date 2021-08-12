import Ember from 'ember';

export default Ember.Component.extend({
	new_email: '',

  	documents: Ember.inject.service(),

  	isNotFilled: Ember.computed('new_email', function(){
  		return !this.get('new_email');
  	}),

  	actions: {
  		addNew: function(){
  			this.sendAction('openNewCollaboratorModal');
  			this.set('active', false);		    
  		},

  		remove: function(id){
  			  var doc_id = this.get('document').get('id');
		      var url = "/v1/collaborators/"+ id
		      var collaborator = {}
		      collaborator["document_id"] = doc_id;
		      var data = {}
		      data['collaborator'] = collaborator
		      $.ajax({
		        url: url,
		        method: "DELETE",
		        dataType: "json",
		        data: data,
		        success: function(data, responseText){
		          // Put any action upon delete record
		        }
		      })
		      this.get('document').reload();
  		}
  	},

	didInsertElement: function() {
  		Ember.run.scheduleOnce('afterRender', this, function() {
	        this.$('.mCustomScrollbar').mCustomScrollbar();
	    });
	}
});