import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('app/dashboard/g-choose-project', 'Integration | Component | app/dashboard/g choose project', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{app/dashboard/g-choose-project}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#app/dashboard/g-choose-project}}
      template block text
    {{/app/dashboard/g-choose-project}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
