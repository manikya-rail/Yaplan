import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('workflows/g-workflow-picker', 'Integration | Component | workflows/g workflow picker', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{workflows/g-workflow-picker}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#workflows/g-workflow-picker}}
      template block text
    {{/workflows/g-workflow-picker}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
