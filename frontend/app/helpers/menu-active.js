import Ember from 'ember';

export function menuActive(params/*, hash*/) {
  if(params[0] && params[1] && params[1].match(new RegExp(params[0]))) {
    return `active ${params[2]}`;
  } else {
    return `${params[2]}`;
  }
}

export default Ember.Helper.helper(menuActive);
