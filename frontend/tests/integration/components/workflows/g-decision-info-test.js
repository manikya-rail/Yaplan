import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('workflows/g-decision-info', 'Integration | Component | workflows/g decision info', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{workflows/g-decision-info}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#workflows/g-decision-info}}
      template block text
    {{/workflows/g-decision-info}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
