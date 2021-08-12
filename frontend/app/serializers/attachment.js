import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  serialize(snapshot, options) {
    var json = this._super(...arguments);
    if (json.id && !json._destroy) {
      json = { id: json.id };
    }
    return json;
  },
});
