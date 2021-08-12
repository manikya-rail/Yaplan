import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('documents/g-templates', 'Integration | Component | documents/g templates', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{documents/g-templates}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#documents/g-templates}}
      template block text
    {{/documents/g-templates}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
