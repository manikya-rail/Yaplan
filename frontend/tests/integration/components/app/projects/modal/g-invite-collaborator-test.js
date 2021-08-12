import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('app/projects/modal/g-invite-collaborator', 'Integration | Component | app/projects/modal/g invite collaborator', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{app/projects/modal/g-invite-collaborator}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#app/projects/modal/g-invite-collaborator}}
      template block text
    {{/app/projects/modal/g-invite-collaborator}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
