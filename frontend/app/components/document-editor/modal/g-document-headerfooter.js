import Ember from 'ember';

export default Ember.Component.extend({
	notification: {
    type: 0,
    msg: ''
  },
  store: Ember.inject.service(),

  visiblityObserver: Ember.observer('active', function() {
    this.set('header', '');
    this.set('footer', '');
  }),

  init() {
    this._super(...arguments);
    this.set('header', '');
    this.set('footer', '');
  },

  isNotFilled: Ember.computed('header', 'footer', function() {
    return (_.isEmpty(this.get('header')) && _.isEmpty(this.get('footer')));
  }),

  actions:{
  	setHeaderFooter(){
  		let componentContext = this;
  		var headerText = this.get('header');
  		var footerText = this.get('footer');
      let store = componentContext.get("store");
      store.findRecord("document", componentContext.get('document').id).then(function(document) {
          document.set("header", headerText),
          document.set("footer", footerText),
          document.save();
      });
      componentContext.set('active',false);
      componentContext.sendAction('showNotification', 'Header Footer Set for the Document');
  	}
  }
});
