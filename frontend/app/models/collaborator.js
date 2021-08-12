/**
 * Represents project entry
 */
import DS from 'ember-data';

export default DS.Model.extend({
  document: DS.belongsTo('document'),
  document_id: DS.attr(),
  message: DS.attr(),
  userEmail: DS.attr('string'),
  userId: DS.attr('number'),
  userName: DS.attr('string'),
  email: DS.attr('string'),
  fullName: DS.attr('string'),
  portrait: DS.attr(),
  status: DS.attr(),
});
