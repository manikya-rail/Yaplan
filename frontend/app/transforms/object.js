import DS from 'ember-data';
import Ember from 'ember';

export default DS.Transform.extend({
  deserialize(serialized, options) {
    var markdownOptions = options || {};
    return serialized;
  },

  serialize(deserialized, options) {
    return deserialized.raw;
  }
});
