import DS from 'ember-data';

export default DS.Model.extend({
  recipient_type: DS.attr('string'),
  ownerType: DS.attr('string'),
  text: DS.attr('string'),
  trackableType: DS.attr('string'),
  trackable: DS.attr(),
  recipient: DS.attr(),
  owner: DS.attr(),
  parameters: DS.attr(),
  createdAt: DS.attr('date'),
  key: DS.attr('string'),
  limit: DS.attr(),
});
