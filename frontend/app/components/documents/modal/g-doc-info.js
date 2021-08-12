import Ember from 'ember';

export default Ember.Component.extend({
	onShowWorkflowAssociated: false,
	actions:{
		viewWorkflows(){
			this.set('onShowWorkflowAssociated',true);
			// this.set('active',false);
		}
	}
});
