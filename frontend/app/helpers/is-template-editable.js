import Ember from 'ember';

export function isTemplateEditable(params/*, hash*/) {
  const template = params[0];
  const isAdmin = params[1];
  const user = params[3];
  if (template.get('is_template')) {
    if (template.get('is_public')) {
      if (isAdmin) {
        return false;
      } else {
        return true;
      }
    } else if (template.get('created_by.id') && user && template.get('created_by.id').toString() === user.get('id').toString()) {
      return true;
    } else {
      return true;
    }
  } else {
    return true;
  }
}

export default Ember.Helper.helper(isTemplateEditable);
