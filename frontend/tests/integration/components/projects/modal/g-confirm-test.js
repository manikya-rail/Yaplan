import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('projects/modal/g-confirm', 'Integration | Component | projects/modal/g confirm', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{projects/modal/g-confirm}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#projects/modal/g-confirm}}
      template block text
    {{/projects/modal/g-confirm}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
