require 'test_helper'

class HelloControllerTest < ActionController::TestCase
  include Devise::TestHelpers # Manually including here, as we are not using our homegrown helper
end
