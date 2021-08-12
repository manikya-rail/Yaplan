import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.createRecord('payment', {
      email: 'test@mail.com',
      stripeToken: '1234'
    });
  },
  actions: {
    chargeUser() {      
      let payment = this.controller.get('model');
      payment.save().then(() => {
        alert("Payment saved.");
        this.transitionTo('app.payment-methods');
      }).catch(() => {
        alert("couldn't save payment.");
      });
    }
  }
});