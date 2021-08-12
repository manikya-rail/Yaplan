import Ember from 'ember';

export default Ember.Component.extend({
	_runLater: null,

	visibilityObserver: Ember.observer('active', function(){
		if (!this.get('autoFade')) return;

		let active = this.get('active');
		
		if (!active)
			this.destroyAutoFade();
		else
			this.setupAutoFade();
	}),

	setupAutoFade: function(){
		let componentContext = this;
		this.set('_runLater', Ember.run.later(this, () => {
		   componentContext.set('active', false);
		}, this.get('autoFade') * 1000));
	},
	destroyAutoFade: function(){
		let _runLater = this.get('_runLater');
		if (_runLater)
			Ember.run.cancel(_runLater);
	}
});