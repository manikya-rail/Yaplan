import { moduleForModel, test } from 'ember-qunit';

moduleForModel('workflow-template', 'Unit | Serializer | workflow template', {
  // Specify the other units that are required for this test.
  needs: ['serializer:workflow-template']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
