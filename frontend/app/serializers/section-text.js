import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    text: {key: 'content'}
  },

  payloadKeyFromModelName(modelName){
    return Ember.String.underscore(modelName);
  },

  /**
   * Nested record id is serialized as string for some reasons.
   * TODO: recheck
   * @param snapshot
   * @param options
   * @return {*}
     */
  serialize: function(snapshot, options){
    var json = this._super(snapshot, options);

    if(json.id){
      json.id = parseInt(json.id);
    }

    return json;
  }
});
