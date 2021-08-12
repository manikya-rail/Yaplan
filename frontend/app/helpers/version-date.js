import Ember from 'ember';
import moment from '../utils/moment';
export function versionDate(params/*, hash*/) {
  return moment(params[0]).format('lll');
}

export default Ember.Helper.helper(versionDate);
