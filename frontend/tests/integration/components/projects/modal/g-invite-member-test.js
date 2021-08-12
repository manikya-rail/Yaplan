import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('projects/modal/g-invite-member', 'Integration | Component | projects/modal/g invite member', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{projects/modal/g-invite-member}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#projects/modal/g-invite-member}}
      template block text
    {{/projects/modal/g-invite-member}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
