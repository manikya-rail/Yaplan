import DS from 'ember-data';
import Task from './task';

export default Task.extend({
  title: DS.attr(),
  user: DS.belongsTo('user'),
  project: DS.belongsTo('project'),
  sectionContainers: DS.hasMany('section-container', { async: false }),
  images: DS.attr(),
  created_by: DS.attr(),
  isTemplate: DS.attr('boolean'),
  isPublic: DS.attr('boolean'),
  published: DS.attr('boolean'),
  collaborators: DS.hasMany('collaborators'),
  createdAt: DS.attr('date', { defaultValue() {
      return new Date(); } }),
  updatedAt: DS.attr('date', { defaultValue() {
      return new Date(); } }),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),
  description : DS.attr(),
  category_name: DS.attr(),
  proposed_startdate : DS.attr(),
  proposed_enddate : DS.attr(),
  state: DS.attr(),
  assigned_to: DS.attr(),
  cover_page: DS.attr(),
  header: DS.attr(),
  footer: DS.attr(),
  logo: DS.attr(),
  show_contents: DS.attr(),
  show_cover: DS.attr(),
  is_template: DS.attr('boolean'),
  is_public: DS.attr('boolean'),
});
