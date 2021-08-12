/**
 * Represents document entry
 */
import DS from 'ember-data';
import Task from './task';
export default Task.extend({

  title: DS.attr(),
  user: DS.belongsTo('user'),
  project: DS.belongsTo('project'),
  created_by: DS.attr(),
  approver: DS.attr(),
  section_containers: DS.hasMany('section-container', { async: false }),
  images: DS.attr(),
  collaborators: DS.attr(),
  state: DS.attr(),
  approverId: DS.attr(),
  category_name: DS.attr(),
  duplicate_from_id: DS.attr(),
  is_template: DS.attr(),
  is_public: DS.attr(),
  linked_documents: DS.attr(),
  published: DS.attr('boolean'),
  description: DS.attr(),
  proposed_startdate: DS.attr(),
  proposed_enddate: DS.attr(),
  collaborator_count: DS.attr(),
  assigned_to: DS.attr(),
  created_at: DS.attr('date', { defaultValue() {
      return new Date(); } }),
  updated_at: DS.attr('date', { defaultValue() {
      return new Date(); } }),
  createdAt: DS.attr('date', { defaultValue() {
      return new Date(); } }),
  updatedAt: DS.attr('date', { defaultValue() {
      return new Date(); } }),
  tags: DS.attr(),
  cover_page: DS.attr(),
  header: DS.attr(),
  footer: DS.attr(),
  logo: DS.attr(),
  subtitle: DS.attr(),
  show_contents: DS.attr(),
  show_page_number: DS.attr(),
  show_cover: DS.attr(),
  is_public: DS.attr(),
});
