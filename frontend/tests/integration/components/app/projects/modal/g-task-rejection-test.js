import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('app/projects/modal/g-task-rejection', 'Integration | Component | app/projects/modal/g task rejection', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{app/projects/modal/g-task-rejection}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#app/projects/modal/g-task-rejection}}
      template block text
    {{/app/projects/modal/g-task-rejection}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
