/**
 * Represents project entry
 */
import DS from 'ember-data';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default DS.Model.extend({
  title: DS.attr(),
  category: belongsTo('category', { async: true }),
  documents: DS.attr(),
  collaborations: DS.hasMany('collaboration'),
  description: DS.attr(),
  assignedDocumentsCount: DS.attr('number'),
  completedTasksCount: DS.attr('number'),
  createdTasksCount: DS.attr('number'),
  created_by: DS.attr(),
  workflow: DS.attr('string'),
  project_workflow: DS.attr(),
  workflow_template_id: DS.attr(),
  archived: DS.attr('boolean'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  progress: DS.attr(),
  startAt: DS.attr('date'),
  endAt: DS.attr('date'),
  role: DS.attr(),
  category_name: DS.attr('string'),
  category_id: DS.attr(),
});
