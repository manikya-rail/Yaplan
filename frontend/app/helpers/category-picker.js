import Ember from 'ember';

export function categoryPicker(params/*, hash*/) {
  return params[0].find(
    category => {
      return category.get('id') === params[1].get('project').get('category.id');
    }
  ).get('name');
}

export default Ember.Helper.helper(categoryPicker);
