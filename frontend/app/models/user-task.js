import DS from 'ember-data';

export default DS.Model.extend({
  user_tasks: DS.attr(),
  task: DS.belongsTo('task'),
  taskType: DS.attr('string'),
  reIssued: DS.attr('boolean'),
  responseStatus: DS.attr('string'),
  project: DS.belongsTo('project'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  projectName: DS.attr('string'),
});
