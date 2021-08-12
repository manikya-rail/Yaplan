import Ember from 'ember';
let inject = Ember.inject;

export default Ember.Component.extend({

store: inject.service(),
session: inject.service(),
router: inject.service(),

actions: {
	selectDocument(id, access){
		let session_data = this.get('session.session.content.authenticated');
	    let self = this;
	    if(access){
	   		self.get('router').transitionTo('app.documents.document-view', id);
	   	}
	}
}

});
