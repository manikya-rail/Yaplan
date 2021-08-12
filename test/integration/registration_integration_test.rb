require 'test_helper'

describe 'RegistrationIntegration' do
  let(:headers) { { Content_type: 'application/json', Accept: 'application/json' } }
  let(:user) { build(:user) }

  it 'creates and then logs in a user' do
    post '/users', { user: { email: user.email, password: user.password, full_name: user.full_name } }, headers
    User.find_by_email(mash_body.payload.email).full_name.must_equal user.full_name
    mail = ActionMailer::Base.deliveries.last
    confirm_account_url = mail.body.match(/<a href=\"([^<]*)\">/)[1]
    get confirm_account_url
    post '/users/sign_in', { user: { email: user.email, password: user.password } }, headers
    headers.merge!('X-User-email' => mash_body.email, 'X-User-token' => mash_body.token)
    get '/test/am_i_authenticated', nil, headers
    assert_response :success
  end

  it 'rejects duplicate email addresses' do
    create(:user)
    post '/users', { user: { email: user.email, password: user.password, full_name: user.full_name } }, headers
    mash_body.success.must_equal false
    mash_body.errors.wont_be :nil
  end
end
