import Ember from 'ember';
import moment from '../utils/moment';

export function fuzzyDate([date, timezone]) {
  return moment(date).zone(timezone).format('DD MMM YYYY');
  // return moment(date).format('DD MMM YYYY');
}

export default Ember.Helper.helper(fuzzyDate);
