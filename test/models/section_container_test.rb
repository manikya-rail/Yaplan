require 'test_helper'

class SectionContainerTest < ActiveSupport::TestCase
  def section_container
    @section_container ||= build(:section_container)
  end

  def test_valid
    assert section_container.valid?
  end
end

describe SectionContainer do
  def section_container
    @section_container ||= create(:section_container)
  end

  def test_valid
    assert section_container.valid?
  end
end
