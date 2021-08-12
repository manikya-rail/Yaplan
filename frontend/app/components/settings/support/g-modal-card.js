import Ember from 'ember';
import bubble from '../../../utils/bubble';

export default Ember.Component.extend({
	cardToken: "",

	actions: {
		select: function(card){
			this.set('cardToken', card.token);
		},
		save: function(){
			let {plan, cardToken} = this.getProperties('plan', 'cardToken');

			this.sendAction('onSavePlan', cardToken, plan.id);
			this.set('active', false);
		},
		add: bubble('onAddCard')
	},

	visibilityObserver: Ember.observer('active', function(){
		let {active, cardToken, cards} = this.getProperties('active', 'cardToken', 'cards');

		if ((active) && (cardToken == "")) {
			//If no card is initiality selected
			this.set('cardToken', cards[0].token);
		}
	}),

	didInsertElement: function() {
  		Ember.run.scheduleOnce('afterRender', this, function() {
	        this.$('.mCustomScrollbar').mCustomScrollbar();
	    });
	}
});