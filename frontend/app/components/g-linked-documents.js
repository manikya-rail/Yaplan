import Ember from 'ember';
let inject = Ember.inject;

export default Ember.Component.extend({
router: inject.service(),

notification: {
	type: 0,
	msg: ''
},

actions: {
	selectDocument(id, access){
	    let self = this;
	    if(access){
	    	self.set('active',false);
	   		self.get('router').transitionTo('app.documents.document-view', id);
	   	}else{
	   		self.set('notification.type', 3);
          	self.set('notification.msg', 'Profile Successfully Updated');
          	setTimeout(function(){
            	self.set('notification.type', 0);
          	}, 2000);
	   	}
	}
}
});
