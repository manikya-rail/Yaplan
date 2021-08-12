import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('app/projects/g-task', 'Integration | Component | app/projects/g task', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{app/projects/g-task}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#app/projects/g-task}}
      template block text
    {{/app/projects/g-task}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
