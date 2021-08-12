import { moduleForModel, test } from 'ember-qunit';

moduleForModel('project-workflow-step', 'Unit | Serializer | project workflow step', {
  // Specify the other units that are required for this test.
  needs: ['serializer:project-workflow-step']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
