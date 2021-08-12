require "test_helper"

class CommunicationTest < ActiveSupport::TestCase
  def communication
    @communication ||= Communication.new
  end

  def test_valid
    assert communication.valid?
  end
end
