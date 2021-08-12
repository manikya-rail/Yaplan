require "test_helper"

class V1::ActivitiesControllerTest < ActionController::TestCase
  def test_index
    get :index
    assert_response :success
  end

end
