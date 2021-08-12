import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('workflows/project-workflow-editor', 'Integration | Component | workflows/project workflow editor', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{workflows/project-workflow-editor}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#workflows/project-workflow-editor}}
      template block text
    {{/workflows/project-workflow-editor}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
