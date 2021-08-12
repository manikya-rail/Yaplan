require "test_helper"

class AttachmentTest < ActiveSupport::TestCase
  def attachment
    @attachment ||= Attachment.new
  end

  def test_valid
    assert attachment.valid?
  end
end
