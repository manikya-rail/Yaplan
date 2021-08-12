import Ember from 'ember';

export function activityName(params/*, hash*/) {
  if (params[0].get('trackableType') === 'Project') {
    return params[0].get('trackable.title');
  } else if (params[0].get('recipientType') === 'Project') {
    return params[0].get('recipient.title');
  } else if(params[0].get('trackableType') === 'Task'){
  	return params[0].get('trackable.title');
  }
}

export default Ember.Helper.helper(activityName);
