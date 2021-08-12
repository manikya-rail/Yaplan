import { moduleForModel, test } from 'ember-qunit';

moduleForModel('workflow-template-step', 'Unit | Serializer | workflow template step', {
  // Specify the other units that are required for this test.
  needs: ['serializer:workflow-template-step']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
