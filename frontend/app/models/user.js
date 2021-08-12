import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr(),
  full_name : DS.attr('string'),
  role: DS.attr(),
  portrait : DS.attr(),
  user_id : DS.attr(),
  time_zone: DS.attr(),
  belongs_to: DS.belongsTo('plan'),
  collaborations: DS.hasMany('Collaboration'),
  projectMemberships: DS.hasMany('project-membership'),
  projects: (function() {
    return this.get('projectMemberships').getEach('user');
  }).property('projectMemberships.@each.relationshipsLoaded')
});
