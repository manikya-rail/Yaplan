require 'test_helper'

# class AuthenticationIntegrationTest < ActionDispatch::IntegrationTest
# end

include Devise::TestHelpers # Manually including here, as we are not using our homegrown helper

describe 'AuthenticationIntegration' do
  let(:headers) { { Content_type: 'application/json', Accept: 'application/json' } }
  let(:user) { create(:user) }

  it 'rejects unauthenticated access' do
    get '/test/am_i_authenticated', nil, headers
    response.status.must_equal 401
  end

  it 'rejects authenticated users that do not provided the authentication email and token' do
    post '/users/sign_in', { user: { email: user.email, password: user.password } }, headers

    # We don't pass the authentication headers
    get '/test/am_i_authenticated', nil, headers
    # The cookie does not let us in
    response.status.must_equal 401
  end

  it 'rejects authenticated users that only provide the authentication email header' do
    post '/users/sign_in', { user: { email: user.email, password: user.password } }, headers

    body = JSON.parse(response.body)
    headers['X-User-email'] = body['email']
    get '/test/am_i_authenticated', nil, headers
    response.status.must_equal 401
  end

  it 'rejects authenticated users that only provide the authentication token' do
    post '/users/sign_in', { user: { email: user.email, password: user.password } }, headers

    body = JSON.parse(response.body)
    headers['X-User-token'] = body['token']
    get '/test/am_i_authenticated', nil, headers
    # The cookie does not let us in
    response.status.must_equal 401
  end

  it 'rejects authenticated users that provide incorrect authentication token' do
    post '/users/sign_in', { user: { email: user.email, password: user.password } }, headers
    body = JSON.parse(response.body)

    headers.merge!('X-User-email' => body['email'], 'X-User-token' => 'fdhkfdhkdfjlhg')
    get '/test/am_i_authenticated', nil, headers
    response.status.must_equal 401
  end

  it 'allows authenticated requests that provide valid token and email' do
    post '/users/sign_in', { user: { email: user.email, password: user.password } }, headers
    body = JSON.parse(response.body)

    headers.merge!('X-User-email' => body['email'], 'X-User-token' => body['token'])
    get '/test/am_i_authenticated', nil, headers
    assert_response :success
  end

  describe 'Password Change' do
    it 'changes the password and reject subsequent access with the old password' do
      post '/users/sign_in', { user: { email: user.email, password: user.password } }, headers
      body = JSON.parse(response.body)
      authenticated_headers = headers.merge('X-User-email' => body['email'], 'X-User-token' => body['token'])

      new_password = 'AZE123az'
      patch '/users', { user: { password: new_password, password_confirmation: new_password,
                                current_password: user.password } }, authenticated_headers
      response.status.must_equal 204
      delete '/users/sign_out', nil, authenticated_headers
      # Old token is still valid.
      post '/users/sign_in', { user: { email: user.email, password: user.password } }, headers
      response.status.must_equal 401
    end
    it 'changes the password and accept subsequent access with the new password' do
      post '/users/sign_in', { user: { email: user.email, password: user.password } }, headers
      body = JSON.parse(response.body)
      authenticated_headers = headers.merge('X-User-email' => body['email'], 'X-User-token' => body['token'])

      new_password = 'AZE123az'
      patch '/users', { user: { password: new_password, password_confirmation: new_password,
                                current_password: user.password } }, authenticated_headers
      response.status.must_equal 204
      delete '/users/sign_out', nil, authenticated_headers

      post '/users/sign_in', { user: { email: user.email, password: new_password } }, headers
      response.status.must_equal 200
    end
  end

  describe 'Update Name after signing in' do
    it 'changes the user name' do
      post '/users/sign_in', { user: { email: user.email, password: user.password } }, headers
      body = JSON.parse(response.body)
      authenticated_headers = headers.merge('X-User-email' => body['email'], 'X-User-token' => body['token'])
      new_name = 'Captain America'
      put '/users/profile', { user: { full_name: new_name } }, authenticated_headers
      response.status.must_equal 200
      User.last.full_name.must_equal 'Captain America'
    end
  end

  describe 'Logout' do
    it 'logs out properly in JSON' do
      post '/users/sign_in', { user: { email: user.email, password: user.password } }, headers
      body = JSON.parse(response.body)
      authenticated_headers = headers.merge('X-User-email' => body['email'], 'X-User-token' => body['token'])
      delete '/users/sign_out', nil, authenticated_headers
      get '/test/am_i_authenticated', nil, authenticated_headers
      response.status.must_equal 401
    end
    # Not important test, it was for my own understanding. Devise redirects to login page.
    it 'logs out properly in HTML' do
      post '/users/sign_in', { user: { email: user.email, password: user.password } }, headers
      delete '/users/sign_out'
      get '/test/am_i_authenticated'
      response.status.must_equal 302
    end
  end

  describe 'Password Reset' do
    # This is an information leak. This is the default from devise though, keeping for now.
    it 'returns an error when the email does not already exist' do
      email = 'ohn@test.Test'
      post '/users/password', { user: { email: email } }, headers
      response.status.must_equal 422
    end

    it 'sends a password reset email' do
      email = user.email
      post '/users/password', { user: { email: email } }, headers
      assert :success
      # TODO, an email is actually sent
    end

    it 'sets the new password up' do
      new_password = 'REfd34d'
      reset_token = user.send_reset_password_instructions
      patch '/users/password', { user: { password: new_password, password_confirmation: new_password,
                                         reset_password_token: reset_token } }, headers
      post '/users/sign_in', { user: { email: user.email, password: new_password } }, headers
      body = JSON.parse(response.body)
      authenticated_headers = headers.merge('X-User-email' => body['email'], 'X-User-token' => body['token'])
      get '/test/am_i_authenticated', nil, authenticated_headers
      response.status.must_equal 200
    end

    it 'sets the new password up with an incorrect token' do
      new_password = 'REfd34d'
      reset_token = 'fdjklfdklj34FDFD4' # user.send_reset_password_instructions
      patch '/users/password', { user: { password: new_password, password_confirmation: new_password,
                                         reset_password_token: reset_token } }, headers
      result = { 'errors' => { 'reset_password_token' => ['is invalid'] } }
      JSON.parse(response.body).must_equal result
      response.status.must_equal 422
    end
  end
end
