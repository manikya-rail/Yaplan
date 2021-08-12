import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQuery: function(slug, modelName) {
    if (slug.type === 'include_invited') {
      delete slug.type;
      return `users/available_projects`;
    } else {
      return this._super(...arguments);
    }
  }
});
