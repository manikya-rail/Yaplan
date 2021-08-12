import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    state: { serialize: false },
    task: { embedded: 'always' },
    communications: { serialize: 'records', deserialize: 'records' },
    category: { serialize: false, deserialize: 'records' },
    isDirty: { serialize: false, deserialize: false },
  },
  serialize(snapshot, options) {
    var json = this._super(...arguments);
    if (json.task) {
      if (json.node_type !== 'communication') {
        json.task_attributes = json.task;
        delete json.task_attributes.state;
      }
    }
    delete json.task;
    return json;
  },
});
