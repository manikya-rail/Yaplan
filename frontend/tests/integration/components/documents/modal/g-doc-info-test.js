import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('documents/modal/g-doc-info', 'Integration | Component | documents/modal/g doc info', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{documents/modal/g-doc-info}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#documents/modal/g-doc-info}}
      template block text
    {{/documents/modal/g-doc-info}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
