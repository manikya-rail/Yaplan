require 'test_helper'

class CollaborationTest < ActiveSupport::TestCase
  def collaboration
    @collaboration ||= Collaboration.new
  end

  it 'Should create a collaboration' do
    collaboration = create(:collaboration)
    assert collaboration.valid?
  end

  it 'Should not create without collaborator' do
    collaboration = build_stubbed(:collaboration_without_collaborator)
    assert !collaboration.valid?, "Can't create collaboration without collaborator"
  end
end
