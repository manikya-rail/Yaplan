class V1::PlansController < ApplicationController
  before_action :authenticate_user!

  api :GET, 'v1/plans', 'retrieve plan'
  def index
    @plans = ChargePlan.all
    render json: { plans: @plans }
  end

  api :GET, 'v1/check_subscription', 'check the users active plan'
  def check_subscription
    plan_id = current_user.charge_plan_id
    unless plan_id
      register_free_plan
      plan_id = current_user.charge_plan_id
    end
    customer_id = current_user.customer_id
    render json: { plan_id: plan_id || 0, customer_id: customer_id, masked_card: current_user.card }
  end

  api :GET, 'v1/update_subscription', 'Create or Update subscription'
  def update_subscription
    target_plan_id = params[:id]
    target_plan = ChargePlan.find(target_plan_id)

    begin
      if !current_user.subscription_id
        result = ChargeBee::Subscription.create_for_customer(current_user.customer_id,	plan_id: target_plan.code)
        new_subscription_id = result.subscription.id
      else
        if target_plan.amount == 0
          ChargeBee::Subscription.delete(current_user.subscription_id)
          new_subscription_id = nil
        else
          result = ChargeBee::Subscription.update(current_user.subscription_id,	plan_id: target_plan.code)
          new_subscription_id = result.subscription.id
        end
      end

      current_user.charge_plan_id = target_plan_id
      current_user.subscription_id = new_subscription_id
      current_user.save

      render json: { result: 'success' }
    rescue ChargeBee::APIError => ex
      render json: generate_failure_response(ex.json_obj[:message].to_s), status: 500
    rescue Exception => ex
      puts ex.to_yaml
      render json: generate_failure_response('Operation Failed. Please contact your support.'), status: 500
    end
  end

  api :GET, 'v1/create_card', 'register user (optional) and add card information'
  def create_card
    op_result = {}

    card_details = {}
    card_details[:number] = params[:card_number]
    card_details[:cvv] = params[:cvv]
    card_details[:expiry_month] = params[:expiry_month]
    card_details[:expiry_year] = params[:expiry_year]

    unless current_user.customer_id
      customer_details = { first_name: current_user.full_name, email: current_user.email }

      result = ChargeBee::Customer.create(customer_details)
      current_user.customer_id = result.customer.id
      current_user.save
       end

    begin
       result = ChargeBee::Card.update_card_for_customer(current_user.customer_id, card_details)

       current_user.card = result.card.masked_number
       current_user.save

       render json: { result: 'success', card: current_user.card }
     rescue ChargeBee::PaymentError => ex
       if 'card[number]' == ex.param
         render json: generate_failure_response('Invalid Card Number. Please check again.'), status: 500
       else
         render json: generate_failure_response('Invalid Card Information. Please check again.'), status: 500
       end
     rescue ChargeBee::OperationFailedError => ex
       render json: generate_failure_response('Operation Failed. Please try again later.'), status: 500
     rescue ChargeBee::APIError => ex
       render json: generate_failure_response('Operation Failed. Please contact your support.'), status: 500
     rescue ChargeBee::IOError => ex
       render json: generate_failure_response('Operation Failed. Please try again later.'), status: 500
     rescue Exception => ex
       render json: generate_failure_response('Operation Failed. Please contact your support.'), status: 500
     end
  end

  private

  def generate_failure_response(msg)
    { result: 'failure', reason: msg }
  end

  def register_free_plan
    free_plan = ChargePlan.find_by(amount: 0)
    if free_plan
      current_user.charge_plan = free_plan
      current_user.save
    end
  end
end
