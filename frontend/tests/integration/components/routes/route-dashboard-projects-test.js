import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('routes/route-dashboard-projects', 'Integration | Component | routes/route dashboard projects', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{routes/route-dashboard-projects}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#routes/route-dashboard-projects}}
      template block text
    {{/routes/route-dashboard-projects}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
