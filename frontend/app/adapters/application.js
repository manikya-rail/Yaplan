import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ActiveModelAdapter from 'active-model-adapter';
import * as _ from 'lodash';

const string = Ember.String;

export default ActiveModelAdapter.extend(DataAdapterMixin, {
  namespace: 'v1',
  authorizer: 'authorizer:grapple',
  ajaxOptions(url, type, options) {
    const hash = this._super(url, type, options);
    hash.timeout = 90000000;
    hash.async = true;
    return hash;
  },
  urlForQueryRecord(slug, modelName) {
    if (slug.id) {
      return `/v1/${string.underscore(string.pluralize(modelName))}/${slug.id}`;
    } else {
      return `/v1/${string.underscore(string.pluralize(modelName))}`;
    }
  },
  urlForFindAll(modelName) {
    return '/v1/' + string.underscore(string.pluralize(modelName));
  },

  urlForCreateRecord(modelName) {
    return '/v1/' + string.underscore(string.pluralize(modelName));
  },

  urlForUpdateRecord(query, modelName) {
    return '/v1/' + string.underscore(string.pluralize(modelName)) + '/' + query;
  },

  urlForDeleteRecord(query, modelName) {
    return '/v1/' + string.underscore(string.pluralize(modelName)) + '/' + query;
  }
});
