import DS from 'ember-data';
import ApplicationSerializer from './application';
export default ApplicationSerializer.extend({
  attrs : {
    section_containers : { embedded : 'always'},
    createdAt: {key: 'created_at'},
    updatedAt: {key: 'updated_at'},
    approverId: {key: 'approver_id'},
    project: { embedded: 'always' }
  },
  serialize(snapshot, options) {
    var json = this._super(...arguments);
    if (json.project) {
      json.project_id = json.project.id;
    }
    delete json.project;
    return json;
  },
});
