import Ember from 'ember';
import * as _ from 'lodash';

export function savedModel(params/*, hash*/) {
  return params[0].filter(model => model.get('id'));
}

export default Ember.Helper.helper(savedModel);
