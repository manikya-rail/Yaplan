// [hotfix] before deprecation will be fixed by simple-auth
import Em from 'ember';

export function initialize(application) {
  Em.Debug.registerDeprecationHandler((message, options, next) => {
    if (options.id === 'ember-application.injected-container') {
      return;
    }
    next(message, options);
  });
}

export default {
  name: 'deprecations',
  initialize
};
