import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('documents/modal/g-template-category', 'Integration | Component | documents/modal/g template category', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{documents/modal/g-template-category}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#documents/modal/g-template-category}}
      template block text
    {{/documents/modal/g-template-category}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
