import Ember from 'ember';

let { get, set } = Ember;

function toggle([prop, context]) {
  return function() {
    context = context || this;
    set(context, prop, !get(context, prop));
  };
}

export default Ember.Helper.helper(toggle);
