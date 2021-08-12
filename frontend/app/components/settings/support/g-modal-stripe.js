import Ember from 'ember';

export default Ember.Component.extend({
	number: '',
	cvv: '',
	expire_month: '',
	expire_year: '',
	processing: false,

	notification: {
		type: 0,
		msg: ""
	},

	isNotFilled: Ember.computed('number', 'cvv', 'expire_month', 'expire_year', 'processing', function(){
		return !(this.get('number') && this.get('cvv') && this.get('expire_month') && this.get('expire_year')) || this.get('processing');
	}),

	visibilityObserver: Ember.observer('active', function(){
		if (!this.get('active')) return;

		this.set('notification', {
			type: 0,
			msg: ""
		});
		this.setProperties({number: '', cvv:'', expire_month: '', expire_year: ''});
	}),

	actions: {
		save: function(){
		  let {number, cvv, expire_month, expire_year} = this.getProperties('number', 'cvv', 'expire_month', 'expire_year');
		  let componentContext = this;
		  var data = {
		  	card_number: number,
		  	cvv: cvv,
		  	expiry_month: expire_month,
		  	expiry_year: expire_year
		  };

		  this.set('notification', {
			type: 3,
			msg: "Processing card information..."
		  });
		  this.set('processing', true);

		  Ember.$.ajax({
	        url: "/v1/create_card",
	        method: "GET",
	        data: data,
	        dataType: "json",
	        success: function(data, responseText){
	          componentContext.set('processing', false);
	          componentContext.sendAction('onCardAdded', data.card);
	        },
	        error: function(jqXHR){
	          componentContext.set('processing', false);
	          componentContext.markError(jqXHR.responseJSON.reason);
	        },
	      });
		},

	    validateEM: function(){
	      let val = this.get('expire_month');

	      if(val <= 0 || val > 12 || isNaN(val)){
	      	this.markError("Invalid expiry month.");
	        this.set('expire_month', '');
	      }else{
	        if(val < 10)
	        	this.set('expire_month', '0'+val);
	      }	      
	    },

	    validateEY: function(){
	      var cur_month = (new Date()).getMonth() + 1;
	      var cur_year = (new Date()).getFullYear();
	      let val = parseInt(this.get('expire_year'));
	      let month = parseInt(this.get('expire_month'));

	      if(isNaN(month)){
	      	this.markError("Please set expiry month first.");
	      	this.set('expire_year', '');
	      }
	      if(isNaN(val)){
	      	this.markError("Invalid expiry year.");
	        this.set('expire_year', '');
	      }else{
	        if(val < cur_year){
	          this.markError("Cannot add expired card.");
	          this.set('expire_year', '');
	        }else{
	          if(cur_year == val && cur_month >=month){
	            this.markError("Cannot add expired card.");
	            this.set('expire_year', '');
	            this.set('expire_month', '');
	          }
	        }
	      }
	    }
	},
  	
  	markError: function(msg){
  		this.set('notification', {
					type: 2,
					msg: msg
				});
  	},

	didInsertElement: function() {
	    Ember.run.scheduleOnce('afterRender', this, function() {
	        this.$('body').setupNaoInput();
	    });
	}
})