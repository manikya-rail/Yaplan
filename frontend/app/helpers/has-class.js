import Ember from 'ember';

export function hasClass(params/*, hash*/) {
  if (!params[0]) return false;
  return params[0].hasClass(params[1]);
}

export default Ember.Helper.helper(hasClass);
