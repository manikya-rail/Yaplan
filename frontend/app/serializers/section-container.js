import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    section_text : { embedded : 'always'}
  },

  payloadKeyFromModelName(modelName){
    return Ember.String.underscore(modelName);
  }
});
