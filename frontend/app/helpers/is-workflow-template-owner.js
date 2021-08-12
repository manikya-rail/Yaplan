import Ember from 'ember';

export function isWorkflowTemplateOwner(params/*, hash*/) {
  const template = params[0];
  const user = params[1];
  if (user && template.get('created_by')) {
    return user.get('id').toString() ===
      template.get('created_by.id').toString();
  } else {
    return false;
  }
  return params;
}

export default Ember.Helper.helper(isWorkflowTemplateOwner);
