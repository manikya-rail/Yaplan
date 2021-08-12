import Ember from 'ember';

export function listedItem(params/*, hash*/) {
  return params[0] + 1;
}

export default Ember.Helper.helper(listedItem);
