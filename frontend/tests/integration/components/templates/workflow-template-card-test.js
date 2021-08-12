import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('templates/workflow-template-card', 'Integration | Component | templates/workflow template card', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{templates/workflow-template-card}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#templates/workflow-template-card}}
      template block text
    {{/templates/workflow-template-card}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
