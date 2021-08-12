import Ember from 'ember';

export function inputId(params/*, hash*/) {
  return params[0] + '_' + params[1]
}

export default Ember.Helper.helper(inputId);
