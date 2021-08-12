import config from '../config/environment';

// The ember-stripe-service add-on relies on Stripe being
// defined. In offline mode, we won't have fetched the real
// stripe.js, so Stripe will be undefined and the add-on's
// initializer will break.
//
// See https://github.com/ride/ember-stripe-service/issues/12
export default {
  name: 'fake-stripe',

  initialize: function() {
    if (config.environment !== 'test') { return; }
    if (typeof Stripe !== 'undefined') { return; }

    window.Stripe = {
      setPublishableKey: function() {},
      card: { createToken: function() {} }
    };
  }
};