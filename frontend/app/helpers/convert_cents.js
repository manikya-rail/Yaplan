import Ember from 'ember';

export function convert_cents(cents) {
  return parseInt(cents) / 100
}

export default Ember.Helper.helper(convert_cents);