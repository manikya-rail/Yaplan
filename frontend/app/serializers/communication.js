import DS from 'ember-data';
import ApplicationSerializer from './application';
export default ApplicationSerializer.extend({
  attrs: {
    attachments: { embedded: 'always' },
  }
});
