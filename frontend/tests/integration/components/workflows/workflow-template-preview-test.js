import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('workflows/workflow-template-preview', 'Integration | Component | workflows/workflow template preview', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{workflows/workflow-template-preview}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#workflows/workflow-template-preview}}
      template block text
    {{/workflows/workflow-template-preview}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
