import Ember from 'ember';
Ember.Handlebars.registerHelper('debug', function(the_string){
  Ember.Logger.log(the_string);
  // or simply
  console.log(the_string);
});