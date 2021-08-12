import DS from 'ember-data';
export default DS.Model.extend({
  category: DS.belongsTo('category', { async: true }),
  structure: DS.attr(),
  name: DS.attr(),
  snapshot: DS.attr(),
  isPublic: DS.attr('boolean'),
  description: DS.attr('string'),
  published: DS.attr('boolean'),
  archived: DS.attr('boolean'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  workflowTemplateSteps: DS.hasMany('workflow-template-steps'),
  // workflowTemplateSteps: DS.attr(),

  // workflowTemplateStepsAttributes: DS.attr(),
  created_by: DS.attr(),
});
