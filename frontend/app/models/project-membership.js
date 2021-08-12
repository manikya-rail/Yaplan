import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user'),
  project: DS.belongsTo('project'),
  relationshipsLoaded: (function() {
    return this.get('user.isLoaded') && this.get('project.isLoaded');
  }).property('user.isLoaded', 'project.isLoaded')
});
