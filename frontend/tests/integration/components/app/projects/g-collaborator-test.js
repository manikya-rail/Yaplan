import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('app/projects/g-collaborator', 'Integration | Component | app/projects/g collaborator', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{app/projects/g-collaborator}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#app/projects/g-collaborator}}
      template block text
    {{/app/projects/g-collaborator}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
