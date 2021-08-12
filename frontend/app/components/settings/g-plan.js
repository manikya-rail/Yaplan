import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service(),

  checkCurrentPlan: function(){
    $.ajax({
      url: "/v1/check_subscription",
      method: "GET",
      dataType: "json",
      success: function(data, responseText){
        $('#'+data+' .desc').text('Current Plan');
      }
     });
  }.on('didRender'),
  actions: {
    save(plan){
      this.sendAction('save', plan);
    }
  },
});
