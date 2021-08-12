import Ember from 'ember';

export function filteredByParam(params/*, hash*/) {
  if (params[2] === 'all') {
    return params[0];
  } else {
    return params[0].filter(model => {
      if (model.get(params[1])) {
        return parseInt(model.get(params[1])) === parseInt(params[2].toString());
      } else {
        return false;
      }
    });
  }
}

export default Ember.Helper.helper(filteredByParam);
