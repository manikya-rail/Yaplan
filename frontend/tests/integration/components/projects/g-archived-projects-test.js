import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('projects/g-archived-projects', 'Integration | Component | projects/g archived projects', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{projects/g-archived-projects}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#projects/g-archived-projects}}
      template block text
    {{/projects/g-archived-projects}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
