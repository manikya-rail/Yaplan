import Ember from 'ember';

export default Ember.Component.extend({
  is_subscribed: false,
  email: '',
  
  actions: {
  	subscribed: function(){ 
  		this.set('is_subscribed', true);

      //Track with Segment
      this.$('body').trackSubscribe(this.get('email')); 
  	}
  },
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
        this.$('body').setupAnimation();        
        //Ember.$.getScript('fb.js');

        //Track with Segment
        this.$('body').trackPageVisit('Home');
    });
  }
});