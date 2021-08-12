import { moduleForModel, test } from 'ember-qunit';

moduleForModel('user-task', 'Unit | Serializer | user task', {
  // Specify the other units that are required for this test.
  needs: ['serializer:user-task']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
