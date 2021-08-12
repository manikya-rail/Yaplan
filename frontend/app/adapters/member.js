import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

let string = Ember.String;

export default DS.RESTAdapter.extend(DataAdapterMixin, {

  authorizer: 'authorizer:grapple',

  urlForFindRecord(id, modelName) {
    return "v1/projects/"+id+"/members";
  }

});
