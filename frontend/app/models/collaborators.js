import DS from 'ember-data';

export default DS.Model.extend({
 message : DS.attr(),
  project_id : DS.attr(),
  collaborators:DS.belongsTo('collaboration')
});
