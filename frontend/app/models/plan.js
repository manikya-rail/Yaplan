import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  project_count: DS.attr(),
  amount: DS.attr(),
  currency: DS.attr(),
  interval: DS.attr(),
  code: DS.attr(),

  isNotUnlimited: Ember.computed.gt('project_count', -1),
  isDummy: Ember.computed.equal('project_count', 0)
});
