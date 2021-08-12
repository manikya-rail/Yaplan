import Ember from 'ember';
import _ from 'lodash';

const chunk = (params) => {
  return _.chunk(params[0].toArray(), params[1])
};
export default Ember.Helper.helper(chunk);

