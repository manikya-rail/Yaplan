require 'test_helper'

class SectionTextTest < ActiveSupport::TestCase
  def section_text
    @section_text ||= build(:section_text)
  end

  def test_valid
    assert section_text.valid?
  end
end
