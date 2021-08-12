import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    assignedDocumentsCount: { serialize: false },
    endAt: { serialize: false },
    completedTasksCount: { serialize: false },
    createdTasksCount: { serialize: false },
  }
});
