import DS from 'ember-data';
import { ActiveModelSerializer } from 'active-model-adapter';
export default ActiveModelSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    sectionContainers: { embedded: 'always' },
    collaborators: { embedded: 'always' },
    project: { embedded: 'always' },
  },
});
