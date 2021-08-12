import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('documents/g-templates-menu', 'Integration | Component | documents/g templates menu', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{documents/g-templates-menu}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#documents/g-templates-menu}}
      template block text
    {{/documents/g-templates-menu}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
