import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({
  store: Ember.inject.service(),

  getCurrentSubscription(){ 
		return new Ember.RSVP.Promise(function(resolve, reject) {
			Ember.$.ajax({
		      url: "/v1/check_subscription",
		      method: "GET",
		      dataType: "json",
		      success: function(data, responseText){
		      	var subscription = data;
		      	// if (data == '' || isNaN(data) || data == 0 || data == null || data == undefined)
		      	// 	plan_id = 0;
		      	// else
		      	// 	plan_id = data;

		    	Ember.run(function() {
		    		resolve(subscription);
		    	});
		      }
		    });
		})
  }
});