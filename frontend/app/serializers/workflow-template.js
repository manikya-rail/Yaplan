import { ActiveModelSerializer } from 'active-model-adapter';
import ApplicationSerializer from './application';
export default ApplicationSerializer.extend({
  attrs: {
    workflowTemplateSteps: { embedded: 'always' },
    created_by: { serialize: false },
    createdAt: { serialize: false },
    updatedAt: { serialize: false },
  }
});
