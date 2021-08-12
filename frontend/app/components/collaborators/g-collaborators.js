import Ember from 'ember';
import $ from 'jquery';

export default Ember.Component.extend({
	isAddCollaboratorOpened: false,
	
	didInsertElement: function(){
		Ember.run.scheduleOnce('afterRender', this, function(){
			$('.grid').masonry({
				itemSelector: '.collaborator',
				columnWidth: '.grid-sizer',
				gutter: 20,
				isAnimated: false,
				transitionDuration: 0
			});
		})
	},

	collaboratorsObserver: Ember.observer('collaborators', function(){
		Ember.run.scheduleOnce('afterRender', this, function(){
			$('.grid').masonry('destroy');
			$('.grid').masonry({
				itemSelector: '.collaborator',
				columnWidth: '.grid-sizer',
				gutter: 20,
				isAnimated: false,
				transitionDuration: 0
			});
		});
	}),

	actions: {
		onSelectDocument: function(document_id){
			this.sendAction('onSelectDocument', document_id);
		}
	}
})