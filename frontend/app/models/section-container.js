import DS from 'ember-data';
import SectionText from './section-text';

export default DS.Model.extend({
  document_id : DS.belongsTo('document', { async: true }),
  section_text: DS.belongsTo('section-text', { async : false}),
  position: DS.attr(),
  linked_documents: DS.attr(),
  comments: DS.attr(),
});
