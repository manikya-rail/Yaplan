require 'test_helper'

describe Users::CheckAuthenticationController do
  include Devise::TestHelpers # Manually including here, as we are not using our homegrown helper

  it 'should rejected users who are not logged in' do
    get :am_i_authenticated, format: :json
    response.status.must_equal 401
  end
end
