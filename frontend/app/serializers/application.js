import DS from 'ember-data';
import { ActiveModelSerializer } from 'active-model-adapter';
import EmbeddedRecordsMixin from '../mixins/embedded-records';
import * as _ from 'lodash';
export default ActiveModelSerializer.extend(DS.EmbeddedRecordsMixin, {
  serializeHasMany(snapshot, json, relationship) {
    let key = relationship.key;
    this._super(...arguments);
    let result = {};
    _.forEach(json[Ember.String.decamelize(key)], (rel, index) => {
      result[index] = rel;
    });
    json[`${Ember.String.decamelize(key)}_attributes`] = result;
    delete json[Ember.String.decamelize(key)];
  }
});
