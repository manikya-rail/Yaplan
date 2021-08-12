require 'test_helper'

class AuthenticationTokenTest < ActiveSupport::TestCase
  def authentication_token
    @authentication_token ||= AuthenticationToken.new
  end

  it 'Create a authentication token' do
    authentication_token = create(:authentication_token)
    assert authentication_token.valid?
  end

  it 'Should not create without user' do
    authentication_token = build_stubbed(:auth_token_no_user)
    assert !authentication_token.valid?, "Can't create token without user"
  end
end
