import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('string'),
  title: DS.attr('string'),
  state: DS.attr('string'),
  description: DS.attr('string'),
  assignedTo: DS.belongsTo('collaborator', { async: true }),
  approver: DS.belongsTo('collaborator', { async: true }),
  userTasks: DS.hasMany('user-task'),
  attachments: DS.hasMany('attachment'),
  project: DS.belongsTo('project', { async: true }),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  // projectId: DS.attr('number'),
});
