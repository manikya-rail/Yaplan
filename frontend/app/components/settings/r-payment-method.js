import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service(),

  retrieve_source: function(){
    $.ajax({
      url: "/v1/retrieve_source",
      method: "GET",
      dataType: "json",
      success: function(data, responseText){
        if(data.length > 0){
          $.each(data, function(i,source){
            $('#source-list').append('<option value='+source.token+'>**** **** **** '+source.card_num+'</option>');
          });
          $('#source-list option[value=""]').remove();
        }else{
          $('#source-list option[value=""]').eq(0).text(' --Choose a card -- ');
        }
        $('#source-list').append('<option value=new_source> --Add a card -- </option>');          
      }
    });
  }.on('init'),
  actions: {
    save(){
      var data = {}
      data['card_number'] = this.controller.get('card_num')
      data['cvv'] = this.controller.get('cvv')
      data['expiry_month'] = this.controller.get('expmonth')
      data['expiry_year'] = this.controller.get('expyear')
      $.ajax({
        url: "/v1/create_card",
        method: "GET",
        data: data,
        dataType: "json",
        success: function(data, responseText){
          alert('Card Information has been saved!')
        },
        error: function(){
          alert('Unable to save card details')
        },
      });

    },
    selSource(){
      var selctd = $('#source-list').val()
      if(selctd== "new_source"){
        $('#card_field').removeClass('hidden');
      }else{
        $('#card_field').addClass('hidden');
      }
    },
    validateCard: function(){
      console.log(this.controller.get('card_num'));
    },
    validateCVV: function(){
      console.log('validateCVV');
    },
    validateEM: function(){
      var str_month = this.controller.get('expmonth');
      var val = parseInt(this.controller.get('expmonth'))
      if(val <= 0 || val > 12 || isNaN(val)){
        alert("Invalid expiry month");
        this.controller.set('expmonth', '')
      }else{
        if(val < 10){
          if (str_month.length == 1)
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
  },
});
