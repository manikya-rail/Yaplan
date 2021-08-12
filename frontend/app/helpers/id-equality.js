import Ember from 'ember';

export function idEquality(params/*, hash*/) {
  if(params[0] && params[1]) {
    return params[0].toString() === params[1].toString();
  } else {
    return false;
  }
}

export default Ember.Helper.helper(idEquality);
