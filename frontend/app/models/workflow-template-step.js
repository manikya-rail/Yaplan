import DS from 'ember-data';

export default DS.Model.extend({
  stepId: DS.attr('number'),
  nodeType: DS.attr('string'),
  node: DS.attr(),
  task: DS.belongsTo('task'),
  description: DS.attr('string'),
  workflowTemplate: DS.belongsTo('workflowTemplate', { async: true }),
  parentStepId: DS.attr('number'),
  nextStepId: DS.attr('number'),
  state: DS.attr('string'),
  communications: DS.hasMany('communication'),
  isDirty: DS.attr('boolean', { defaultValue() { return false; } }),
  _destroy: DS.attr('boolean'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
});
