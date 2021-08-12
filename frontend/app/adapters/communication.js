import ApplicationAdapter from './application';
import FormDataAdapterMixin from 'ember-cli-form-data/mixins/form-data-adapter';
export default ApplicationAdapter.extend(FormDataAdapterMixin, {
  serialize(snapshot, options) {
    var json = this._super(...arguments);
    debugger;
    if (json.attachments) {
      json.attachments_attributes = json.attachments;
    }
    delete json.task;
    // json.data.attributes.cost = {
    //   amount: json.data.attributes.amount,
    //   currency: json.data.attributes.currency
    // };

    // delete json.data.attributes.amount;
    // delete json.data.attributes.currency;

    return json;
  },
});
