import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('projects/modal/g-project-delete', 'Integration | Component | projects/modal/g project delete', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{projects/modal/g-project-delete}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#projects/modal/g-project-delete}}
      template block text
    {{/projects/modal/g-project-delete}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
