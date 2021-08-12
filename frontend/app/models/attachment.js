import DS from 'ember-data';

export default DS.Model.extend({
  fileAttachment: DS.attr('file'),
  _destroy: DS.attr('boolean'),
  name: Ember.computed.alias('attachment.file_attachment.name')
});
