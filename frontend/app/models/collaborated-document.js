/**
 * Represents collaborated document entry
 */
import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr(),
  project_id: DS.attr(),
  collaborators: DS.attr()
});
