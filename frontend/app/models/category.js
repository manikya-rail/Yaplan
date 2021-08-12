import DS from 'ember-data';

export default DS.Model.extend({
	P_id: DS.attr(),
	name: DS.attr('string'),
	image: DS.attr(),
  updatedAt: DS.attr('date'),
});
