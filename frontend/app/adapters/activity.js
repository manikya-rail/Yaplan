import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQuery: function(slug, modelName) {
    if (slug.type === 'pending_invitations') {
      return `/v1/collaborations/get_pending_invitations`;
    } else {
      return this._super(...arguments);
    }
  }
});
