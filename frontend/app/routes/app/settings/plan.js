import Ember from 'ember';

export default Ember.Route.extend({

  model(){
    return Ember.RSVP.hash({
      plans: this.store.findAll('plan'),
    });
  },
  actions : {
    save: function(plan){
      var card = {}
      if($('#source-list option:selected').val()){
        card['token'] = $('#source-list option:selected').val()
      }else{
        return alert('Select a source first')
      }

      $.ajax({
      url: "/v1/plans/"+plan.id+"/create_subscription",
      method: "GET",
      data: card,
      dataType: "json",
      success: function(data, responseText){
        alert("Thank you for your subscription");
        $('.container .desc').text('Click to Subscribe');
        $('#'+data+' .desc').text('Current Plan');
      },
      error: function(){
        alert("Subscription failed");
      }
     });
     this.get('plan').reload()
    },
  }
});
