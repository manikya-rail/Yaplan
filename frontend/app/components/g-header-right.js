import Ember from 'ember';

export default Ember.Component.extend({

List : true,
Tile : false,
isList: false,
isTile: true,

actions :{
	listAction(){
		// console.log(this.get('isList'))
		// console.log("am called")
		this.sendAction('listAction');
	},

	tileAction(){
		// console.log(this.get('isTile'))
		// console.log("am called")
		this.sendAction('tileAction')
	},

  addTemplate() {
    this.sendAction('addTemplate');
  }
}

});
