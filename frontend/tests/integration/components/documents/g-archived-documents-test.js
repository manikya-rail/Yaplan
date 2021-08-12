import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('documents/g-archived-documents', 'Integration | Component | documents/g archived documents', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{documents/g-archived-documents}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#documents/g-archived-documents}}
      template block text
    {{/documents/g-archived-documents}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
