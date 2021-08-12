import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('workflows/g-workflow-template', 'Integration | Component | workflows/g workflow template', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{workflows/g-workflow-template}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#workflows/g-workflow-template}}
      template block text
    {{/workflows/g-workflow-template}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
