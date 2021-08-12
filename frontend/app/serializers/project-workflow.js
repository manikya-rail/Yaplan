import DS from 'ember-data';
import { ActiveModelSerializer } from 'active-model-adapter';
import ApplicationSerializer from './application';
export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    projectWorkflowSteps: { embedded: 'always' },
    category: { serialize: false, deserialize: 'records' },
    projectName: { serialize: false },
    project: { serialize: false },
    created_by: { serialize: false },
    createdAt: { serialize: false },
    updatedAt: { serialize: false },
  },
});
