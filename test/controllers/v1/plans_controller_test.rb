require 'test_helper'
require 'stripe_mock'

describe V1::PlansController do
  let(:user) { create(:user) }
  let(:customer) { Stripe::Customer.create(email: user.email) }
  let(:stripe_helper) { StripeMock.create_test_helper }
  before do
    sign_in user
    StripeMock.start
  end

  after do
    reset_sign_in
    StripeMock.stop
  end

  it 'create sources' do
    card = stripe_helper.generate_card_token(
      card: {
        number: '4242424242424242',
        cvc: '1234',
        exp_month: '12',
        exp_year: '2016'
      }
    )
    assert_response :success if customer.sources.create({ source: card }, Stripe.api_key)
  end
  it 'create a customer with card and plan' do
    api_key = 'sk_test_VYU1BunaPCWXZp9r3k731K7C'
    card = stripe_helper.generate_card_token(
      number: '4242424242424242',
      cvc: '1234',
      exp_month: '12',
      exp_year: '2016'
    )
    plan = stripe_helper.create_plan(id: 'test_plan', amount: 1500)
    cus = Stripe::Customer.create({ email: user.email, source: card, plan: 'test_plan' }, Stripe.api_key)
  end
end
