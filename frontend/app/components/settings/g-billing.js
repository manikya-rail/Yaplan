import Ember from 'ember';

export default Ember.Component.extend({

	isStripeDialogOpened: false,
    isCardDialogOpened: false,
    processing: false,

    cards: [],

    notification: {
        type: 0,
        msg: ""
    },

    tempPlan: "",

    retrieveCards: function(){
        //this.opRetrieveCards();
    }.on('init'),

    afterAttrs: function(){
        console.log("Current plan : "+ this.get('subscription'));
    }.on('didReceiveAttrs'),

    subscribeToPlan: function(plan){
        let componentContext = this;

        this.set('processing', true);
        this.set('notification', {
            type: 3,
            msg: "Updating your subscription. Please wait..."
        });

        Ember.$.ajax({
          url: "/v1/plans/"+plan.id+"/update_subscription",
          method: "GET",
          dataType: "json",
          success: function(data, responseText){
                componentContext.set('notification', {
                    type: 100,
                    msg: "Thank you. Subscription succeeded."
                });
                componentContext.set('processing', false);
                componentContext.set('subscription.plan_id', plan.id);
            },
          error: function(jqXHR){
            componentContext.set('processing', false);
            componentContext.set('notification', {
                type: 2,
                msg: jqXHR.responseJSON.reason
            });
          }
        });
    },

    actions: {
        select: function(plan){
        // Skip when there's process ongoing
            let disabled = this.get('processing');
            if (disabled) return;
        // Skip when current plan is selected again
            let current_subscription = this.get('subscription');
            if (current_subscription.plan_id == plan.id) return;


        // Case study : When there's no card defined
            this.set('tempPlan', plan);
            if (!current_subscription.masked_card){                
                this.set('isStripeDialogOpened', true);
            } else {
                this.set('isSubscribeDialogOpened', true);
            }
        },

        processWNewCard : function(card_num){
            console.log("Card number : " + card_num);
            this.set('subscription.masked_card', card_num);
            this.set('isStripeDialogOpened', false);
            this.set('isSubscribeDialogOpened', true);
        },

        subscribePlan : function(plan){
            this.set('isSubscribeDialogOpened', false);
            this.subscribeToPlan(plan);
        },
        changeCard: function(){
            this.set('isSubscribeDialogOpened', false);
            this.set('isStripeDialogOpened', true);
        }
    },

    /*actions: {
    	select: function(plan){
            let disabled = this.get('processing');
            if (disabled) return;

            let cards = this.get('cards');
            this.set('tempPlan', plan);

            if (cards.length == 0){
                //No card added
                this.set('isStripeDialogOpened', true);
            }else{
                //There are some cards
                this.set('isCardDialogOpened', true);
            }
    	},

        addCard: function(){
            this.set('isCardDialogOpened', false);
            this.set('isStripeDialogOpened', true);
        },

        processWNewCard: function(){
            let componentContext = this;
            
            this.set('isStripeDialogOpened', false);
            this.opRetrieveCards(function(){
                componentContext.set('isCardDialogOpened', true);
            });            
        },

        savePlan: function(card_token, plan_id){
            this.opSavePlan(card_token, plan_id);  
        }
    }, */

    /* opRetrieveCards: function(callback){
        let componentContext = this;

        this.set('processing', true);
        componentContext.set('notification', {
            type: 3,
            msg: "Fetching payment options. Please wait..."
        });

        Ember.$.ajax({
              url: "/v1/retrieve_source",
              method: "GET",
              dataType: "json",
              success: function(data, responseText){
                if (!Array.isArray(data)){
                    //Some exception handling (response is kind of broken in its response)
                    componentContext.set('cards', []);    
                }else{
                    componentContext.set('cards', data);    
                }
                
                componentContext.set('processing', false);
                componentContext.set('notification', {
                    type: 0,
                    msg: ""
                });
                if (callback!=null) callback();
              },
              error: function(){
                componentContext.set('processing', false);
                componentContext.set('notification', {
                    type: 2,
                    msg: "Failed to retrieve card information. Please contact support."
                });
              }
        });

    },*/

    /* opSavePlan: function(card_token, plan_id){
        let componentContext = this;

        this.set('processing', true);
        this.set('notification', {
            type: 3,
            msg: "Processing your request. Please wait..."
        });

        Ember.$.ajax({
          url: "/v1/plans/"+plan_id+"/create_subscription",
          method: "GET",
          data: {
            token: card_token
          },
          dataType: "json",
          success: function(data, responseText){
            if (data.success === false){
                componentContext.set('processing', false);
                componentContext.set('notification', {
                    type: 2,
                    msg: "Failed to subscribe. Please try again."
                });
            }else{
                componentContext.set('notification', {
                    type: 100,
                    msg: "Thank you. Subscription succeeded."
                });
                componentContext.set('processing', false);
                componentContext.set('current_plan_id', plan_id);    
                }
            },
          error: function(){
            componentContext.set('processing', false);
            componentContext.set('notification', {
                type: 2,
                msg: "Failed to subscribe. Please try again."
            });
          }
        });
    } */
});