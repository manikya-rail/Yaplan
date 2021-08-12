import DS from 'ember-data';

export default DS.Model.extend({
  project: DS.belongsTo('project', { async: true }),
  projectName: DS.attr('string'),
  workflowTemplate: DS.belongsTo('WorkflowTemplate', { async: true }),
  locked: DS.attr('boolean'),
  workflowTemplateId: DS.attr("number"),
  projectWorkflowSteps: DS.hasMany('project-workflow-step'),
  name: DS.attr("string"),
  description: DS.attr('string'),
  structure: DS.attr(),
  snapshot: DS.attr(),
  category: DS.belongsTo("category"),
  created_by: DS.attr(),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
});
