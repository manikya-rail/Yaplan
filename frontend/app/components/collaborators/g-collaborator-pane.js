import Ember from 'ember';
import $ from 'jquery';

export default Ember.Component.extend({
	expanded: false,

	heightObserver: Ember.observer('expanded', 'active', function(){
		Ember.run.scheduleOnce('afterRender', this, function(){
			$('.grid').masonry();
		});
	}),

	didInsertElement: function(){
		Ember.run.scheduleOnce('afterRender', this, function(){
		//	$('.grid').masonry();
		});
	},

	actions: {
		onGoTo: function(document_id){
			this.sendAction('onSelectDocument', document_id);
		}
	}
})