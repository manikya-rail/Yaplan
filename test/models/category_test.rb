require 'test_helper'

class CategoryTest < ActiveSupport::TestCase
  def category
    @category ||= Category.new
  end

  it 'Should create a category' do
    category = create(:category)
    assert category.valid?
  end

  it 'Should not create without name' do
    category = build_stubbed(:category_without_name)
    assert !category.valid?, "Can't create category with no name"
  end

  it 'Should not be archived or published by default' do
    category = create(:category)
    category.is_archived.must_equal false
    category.is_published.must_equal false
  end
end
