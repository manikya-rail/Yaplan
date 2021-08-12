import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    $.ajax({
      url: "/v1/get_stripe_plans",
      method: "GET",
      dataType: "json",
      success: function(data, responseText){
        $.each(data, function(i,plan){
          $('#plan_select').append('<option>'+plan+'</option>');
        });
        $('option.blank').text(' --Choose a plan -- ');
      }
    });
  },
  actions: {
    createPlan: function() {
      var params = {};
      params['plan_name'] = $('#plan_select').val() || ""; 
      params['card_number'] =  this.controller.get('cardno') || "";
      params['cvv'] =  this.controller.get('cvv') || "";
      params['expiry_month'] = this.controller.get('expmonth') || "";
      params['expiry_year'] = this.controller.get('expyear') || "";
      var errors = [];
      for (var key in params) {
        if(params[key].length == 0){
          var arr = key.split('_')
          for(var i=0; i<arr.length;i++){
            arr[i] = arr[i].capitalize()
          }
          errors.push(arr.join(" "))
        }
      }
      if(errors.length > 0){
        alert('Please fill out the following fields:\n'+ errors.join(', \n'));
      }else{
        $.ajax({
          url: "/v1/subscribe",
          method: "GET",
          data: params,
          dataType: "json",
          success: function(data, responseText){
            alert("Thank you for your subscription.");
            this.transitionTo('app.projects.projects');
          },
          error: function(){
            alert("Subscription failed. Please try again.");
          }
        });

        // this.store.createRecord('plan',params).save().then(() => {
        //   alert("Thank you for your subscription.");
        //   this.transitionTo('app.projects.projects');
        // }).catch(() => {
        //   alert("Subscription failed. Please try again.");
        // });
      }
    },
    validateCard: function(){
      console.log('validateCard');
    },
    validateCVV: function(){
      console.log('validateCard');
    },
    validateEM: function(){
      var val = parseInt(this.controller.get('expmonth'))
      if(val <= 0 || val > 12 || isNaN(val)){
        alert("Invalid expiry month");
        this.controller.set('expmonth', '')
      }else{
        if(val < 10){
          this.controller.set('expmonth', '0'+val)
        }
      }
    },
    validateEY: function(){
      var cur_month = (new Date()).getMonth() + 1;
      var cur_year = (new Date()).getFullYear();
      var val = parseInt(this.controller.get('expyear'));
      var month = parseInt(this.controller.get('expmonth'));
      if(isNaN(month)){
        alert("Please set expiry month first");
        return this.controller.set('expyear', '')
      }
      if(isNaN(val)){
        alert("Invalid expiry year");
        this.controller.set('expyear', '')
      }else{
        if(val < cur_year){
          alert("Cannot add expired card");
          this.controller.set('expyear', '')
        }else{
          if(cur_year == val && cur_month >=month){
            alert("Cannot add expired card");
            this.controller.set('expyear', '')
            this.controller.set('expmonth', '')
          }
        }
      }
    },

  }
});