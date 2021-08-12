import Ember from 'ember';

export function activityTitle(params/*, hash*/) {
  switch(params[0]) {
    case 'project.invitation':
      return 'Project Invitation'
    default:
      return '';
  }
}

export default Ember.Helper.helper(activityTitle);
