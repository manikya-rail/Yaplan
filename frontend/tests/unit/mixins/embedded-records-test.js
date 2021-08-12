import Ember from 'ember';
import EmbeddedRecordsMixin from '../../../mixins/embedded-records';
import { module, test } from 'qunit';

module('Unit | Mixin | embedded records');

// Replace this with your real tests.
test('it works', function(assert) {
  let EmbeddedRecordsObject = Ember.Object.extend(EmbeddedRecordsMixin);
  let subject = EmbeddedRecordsObject.create();
  assert.ok(subject);
});
