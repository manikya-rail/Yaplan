import Ember from 'ember';

export function filteredActivitiesByProject(params/*, hash*/) {
  if (params[1] === 'all') {
    return params[0];
  } else {
    return params[0].filter(model => (
      (model.get('trackableType') === 'Project' &&
        (model.get('trackable.id') || "").toString() === params[1]) ||
        (model.get('recipientType') === 'Project' &&
          (model.get('trackable.id') || "").toString() === params[1])
    ));
  }
}

export default Ember.Helper.helper(filteredActivitiesByProject);
