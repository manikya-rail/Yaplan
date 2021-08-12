require 'test_helper'

describe Image do
  let(:image) { build(:valid_image) }

  it 'should have a valid image' do
    assert image.valid?
  end
end
