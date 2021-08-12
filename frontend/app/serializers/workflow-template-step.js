import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    task: { embedded: 'always' },
    state: { serialize: false },
    communications: { serialize: 'records', deserialize: 'records' },
    isDirty: { serialize: false, deserialize: false },
    createdAt: { serialize: false },
    updatedAt: { serialize: false },
  },
  serialize(snapshot, options) {
    var json = this._super(...arguments);
    if (json.task) {
      if (json.node_type === 'action') {
        json.task_attributes = json.task;
        delete json.task_attributes.state;
        delete json.task_attributes.user_tasks_attributes;
      } else if (json.node_type === 'document') {
        json.task_id = json.task.id
        delete json.task;
      }
    }
    delete json.task;
    return json;
  },
});
