import DS from 'ember-data';

export default DS.Model.extend({
  communications: DS.hasMany('communication'),
  task: DS.belongsTo('task', { async: false }),
  category: DS.belongsTo('category'),
  node: DS.attr(),
  description: DS.attr('string'),
  nodeType: DS.attr('string'),
  nextStepId: DS.attr('number'),
  parentStepId: DS.attr('number'),
  projectWorkflow: DS.belongsTo('project-workflow', { async: true }),
  state: DS.attr('string'),
  stepId: DS.attr('number'),
  isDirty: DS.attr('boolean', { defaultValue() { return false; } }),
  _destroy: DS.attr('boolean'),
});
