require 'test_helper'

describe Project do
  let(:project) { build(:project) }

  it 'should have a valid project' do
    assert project.valid?
  end

  it 'should archive its own documents' do
    document = create(:document)
    project.archived.must_equal false
    project = document.project
    project.archive!
    project.reload
    project.archived.must_equal true
    document.reload
    document.archived.must_equal true
  end
end
