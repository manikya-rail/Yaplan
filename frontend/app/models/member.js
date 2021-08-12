import DS from 'ember-data';

export default DS.Model.extend({
  // projectMemberships: DS.hasMany('project-membership'),
  user_name : DS.attr(),
  collaborator : DS.attr(),
  project_access : DS.attr(),
  collaborations : DS.attr(),
});
