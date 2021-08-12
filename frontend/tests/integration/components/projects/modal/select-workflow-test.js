import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('projects/modal/select-workflow', 'Integration | Component | projects/modal/select workflow', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{projects/modal/select-workflow}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#projects/modal/select-workflow}}
      template block text
    {{/projects/modal/select-workflow}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
