import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('workflows/set-approver', 'Integration | Component | workflows/set approver', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{workflows/set-approver}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#workflows/set-approver}}
      template block text
    {{/workflows/set-approver}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
