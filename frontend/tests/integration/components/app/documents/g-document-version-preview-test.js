import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('app/documents/g-document-version-preview', 'Integration | Component | app/documents/g document version preview', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{app/documents/g-document-version-preview}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#app/documents/g-document-version-preview}}
      template block text
    {{/app/documents/g-document-version-preview}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
