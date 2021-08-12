import Ember from 'ember';

export function safeStyle(params/*, hash*/) {
  let style = params[1];
  return Ember.String.htmlSafe(`background: url('${params[0]}'); ${style}`);
}

export default Ember.Helper.helper(safeStyle);
