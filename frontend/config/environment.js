/* jshint node: true */

module.exports = function(environment){
  var ENV = {
    modulePrefix: 'frontend',
    environment: environment,
    baseURL: '/',
    locationType: 'hash',
    // tinyMCE:{
    //   version: 4 //default 4.4
    // },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV['ember-simple-auth'] = {
    authenticationRoute : 'reg.login',
    routeAfterAuthentication: 'app',
    routeIfAlreadyAuthenticated: 'app'
  };

  if(environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV['segment'] = {
      WRITE_KEY: 'nt35LJpQUjOBJxtBsGQvoee0cS6hXxU0',
      LOG_EVENT_TRACKING: true
    };
  }

  if(environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if(environment === 'production') {
    ENV['segment'] = {
      WRITE_KEY: (process.env.SEGMENT_WRITE_KEY || 'nt35LJpQUjOBJxtBsGQvoee0cS6hXxU0'),
      LOG_EVENT_TRACKING: true
    };
  }

  if(environment === 'production'){
    ENV["newRelic"] = {
        applicationId: "83109988",
        licenseKey: "713931fc77",
        spaMonitoring: true
    };
  }
   if(environment === 'development'){
    ENV["newRelic"] = {
        applicationId: "70195527",
        licenseKey: "6cfef0d4f5",
        spaMonitoring: true
    };
  }

  ENV.stripe = {
    publishableKey: 'pk_test_j6ajISLT9MgSq9wkdkdS9qtH',
    secretKey: 'sk_test_VYU1BunaPCWXZp9r3k731K7C'
  };
  return ENV;
};
