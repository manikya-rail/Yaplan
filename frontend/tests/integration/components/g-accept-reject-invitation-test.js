import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('g-accept-reject-invitation', 'Integration | Component | g accept reject invitation', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{g-accept-reject-invitation}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#g-accept-reject-invitation}}
      template block text
    {{/g-accept-reject-invitation}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
