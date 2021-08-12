import Ember from 'ember';
import * as _ from 'lodash';

export function filteredAttachments(params/*, hash*/) {
  return params[0].filter(attachment => !attachment.get('id') || !attachment.get('_destroy'));
}

export default Ember.Helper.helper(filteredAttachments);
