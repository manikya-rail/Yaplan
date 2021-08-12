import ApplicationSerializer from './application';
export default ApplicationSerializer.extend({
  attrs: {
    project: { serialize: false, deserialize: 'id' },
    state: { serialize: false },
    userTasks: { serialize: false },
    attachments: { embedded: 'always' },
    createdAt: { serialize: false },
    updatedAt: { serialize: false },
  },
  serialize(snapshot, options) {
    var json = this._super(...arguments);
    if (json.type !== 'Action') {
      delete json.attachments_attributes;
    }
    return json;
  },
});
