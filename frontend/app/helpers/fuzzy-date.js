import Ember from 'ember';
import moment from '../utils/moment';

export function fuzzyDate([date, timezone]) {
	// let timezone = "Antarctica/McMurdo";
// return	moment("2014-10-18T06:14:41.512Z").zone('Pacific/Auckland').format('YYYY-MM-DD HH:mm');
  // return moment("2017-09-24T05:15:20.511Z").zone(timezone).format('YYYY-MM-DD HH:mm');
  return moment(date).zone(timezone).format('MMM Do YYYY HH:mm:ss');
  // return moment(date).format('MMM Do YYYY HH:mm:ss');
}

export default Ember.Helper.helper(fuzzyDate);
