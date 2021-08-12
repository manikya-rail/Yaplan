import Ember from 'ember';

export function attachmentFileName(params/*, hash*/) {
  if (params[0] && params[0].fileAttachment)
    return params[0].fileAttachment.name;
}

export default Ember.Helper.helper(attachmentFileName);
