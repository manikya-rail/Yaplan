import DS from 'ember-data';

export default DS.Model.extend({
  document: DS.belongsTo('document'),
  document_id: DS.attr(),
  image: DS.attr()
});
