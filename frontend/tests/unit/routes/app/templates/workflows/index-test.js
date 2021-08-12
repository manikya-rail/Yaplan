import { moduleFor, test } from 'ember-qunit';

moduleFor('route:app/templates/workflows/index', 'Unit | Route | app/templates/workflows/index', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
