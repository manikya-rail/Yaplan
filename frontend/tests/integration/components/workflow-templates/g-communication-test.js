import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('workflow-templates/g-communication', 'Integration | Component | workflow templates/g communication', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{workflow-templates/g-communication}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#workflow-templates/g-communication}}
      template block text
    {{/workflow-templates/g-communication}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
