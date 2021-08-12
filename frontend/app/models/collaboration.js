import DS from 'ember-data';

export default DS.Model.extend({
  // user: DS.belongsTo('User'),
  is_accepted: DS.attr('boolean'),
  user_name: DS.attr('string'),
  userEmail: DS.attr('string'),
  project_access: DS.attr(),
  invited_by: DS.attr('string'),
  status: DS.attr('string'),
});
