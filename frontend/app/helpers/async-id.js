import Ember from 'ember';

export function asyncId(params/*, hash*/) {
  return params[0].belongsTo(params[1]).id();
}

export default Ember.Helper.helper(asyncId);
