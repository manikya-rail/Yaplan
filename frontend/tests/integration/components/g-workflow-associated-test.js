import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('g-workflow-associated', 'Integration | Component | g workflow associated', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{g-workflow-associated}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#g-workflow-associated}}
      template block text
    {{/g-workflow-associated}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
