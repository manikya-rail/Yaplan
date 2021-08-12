import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ActiveModelAdapter from 'active-model-adapter';
import * as _ from 'lodash';

let string = Ember.String;

export default ActiveModelAdapter.extend(DataAdapterMixin, {

  authorizer: 'authorizer:grapple',
  urlForQueryRecord(slug, modelName) {
    return `/${string.underscore(modelName)}`;
  },
  urlForFindAll(modelName) {
    return '/' + string.underscore(modelName);
  },

  urlForCreateRecord(modelName) {
    return '/' + string.underscore(string.pluralize(modelName));
  },

  urlForUpdateRecord(query, modelName) {
    return '/' + string.underscore(modelName) + '/' + query;
  },

  urlForDeleteRecord(query, modelName) {
    return '/' + string.underscore(modelName) + '/' + query;
  }
});
