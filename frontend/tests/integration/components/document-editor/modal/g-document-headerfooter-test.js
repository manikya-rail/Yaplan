import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('document-editor/modal/g-document-headerfooter', 'Integration | Component | document editor/modal/g document headerfooter', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{document-editor/modal/g-document-headerfooter}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#document-editor/modal/g-document-headerfooter}}
      template block text
    {{/document-editor/modal/g-document-headerfooter}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
