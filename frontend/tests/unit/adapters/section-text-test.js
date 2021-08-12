import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:section-text', 'Unit | Adapter | section text', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});

// Replace this with your real tests.
test('Does not camelize', function(assert) {
  var adapter = this.subject();
  assert.equal(adapter.urlForCreateRecord('sectionText'), 'section_text');
});
