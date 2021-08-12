import Ember from 'ember';

export default Ember.Component.extend({
	
	isList: false,
	isTile: true,

initFormFields: function() {
	
		this.set('isList', false);
    	this.set('isTile', true);

}.on('didReceiveAttrs'),

actions: {
	listAction: function(){
		this.set('isList', true);
		this.set('isTile', false);
	},

	tileAction: function(){
		this.set('isList', false);
		this.set('isTile', true);
	}
}

});
