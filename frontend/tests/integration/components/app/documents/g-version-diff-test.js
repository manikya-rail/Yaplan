import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('app/documents/g-version-diff', 'Integration | Component | app/documents/g version diff', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{app/documents/g-version-diff}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#app/documents/g-version-diff}}
      template block text
    {{/app/documents/g-version-diff}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
