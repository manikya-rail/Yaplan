import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('html-editor/g-html-editor', 'Integration | Component | html editor/g html editor', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{html-editor/g-html-editor}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#html-editor/g-html-editor}}
      template block text
    {{/html-editor/g-html-editor}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
