import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

let string = Ember.String;

export default DS.RESTAdapter.extend(DataAdapterMixin, {
  namespace: 'v1',
  authorizer: 'authorizer:grapple',

  pathForType: function(modelName) {
    var path = "collaborators";
    return path;
  }

});
