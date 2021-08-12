class StripeService
  def retrieve_customer_details(user_id)
    user = User.find(user_id)
    if user.customer_id.nil?
      @customer = Stripe::Customer.create(email: user.email)
      user.update_attribute('customer_id', @customer.id)
    else
      @customer = Stripe::Customer.retrieve(user.customer_id)
    end
    @customer
  end

  def get_card(user_id, token)
    customer = retrieve_customer_details(user_id)
    card = customer.sources.retrieve(token)
    card
  end

  def generate_card(user_id, params = {})
    customer = retrieve_customer_details(user_id)

    card_token =
      Stripe::Token.create(
        card: {
          number: params[:card_number],
          cvc: params[:cvv],
          exp_month: params[:expiry_month],
          exp_year: params[:expiry_year]
        }
      )
    customer.sources.create(source: card_token.id)
    charge_to_customer_card(user_id, card_token.card.id)
  end

  def charge_to_customer_card(user_id, card_id)
    customer = retrieve_customer_details(user_id)
    customer.default_source = card_id
    customer.save
  end

  def list_card(user_id)
    customer = retrieve_customer_details(user_id)
    cards = customer.sources.all(object: 'card')
    card_list = []
    cards.data.each do |card, _i|
      source = {}
      source[:token] = card.id
      source[:card_num] = card.last4
      card_list << source
    end
    card_list
  end

  def retrieve_plan(plan_id)
    plan = Stripe::Plan.retrieve(plan_id)
    plan
  end

  def unsubscribe_me(user_id)
    customer = retrieve_customer_details(user_id)
    old_plan = Plan.find(User.find(user_id).plan_id).name
    plan_name = retrieve_plan(old_plan).id
    customer.subscriptions.data.each do |sub|
      if sub.plan.name == plan_name
        customer.subscriptions.retrieve(sub.id).delete
      end
    end
  end

  def join_subscription(user_id, plan_id, token)
    card = get_card(user_id, token)
    plan = retrieve_plan(plan_id)
    customer = retrieve_customer_details(user_id)

    charge_to_customer_card(user_id, card.id)
    unsubscribe_me(user_id)

    customer.subscriptions.create(plan: plan)
  end
end
