import Ember from 'ember';

export function nodeDetail(params/*, hash*/) {
  const cy = params[0];
  const element = cy.elements(`.${params[1]}`)[0];
  return element.data(params[2]);
}

export default Ember.Helper.helper(nodeDetail);
