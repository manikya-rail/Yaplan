import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('archived-document-templates', 'Integration | Component | archived document templates', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{archived-document-templates}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#archived-document-templates}}
      template block text
    {{/archived-document-templates}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
