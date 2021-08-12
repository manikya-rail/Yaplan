require 'test_helper'

class UserTest < ActiveSupport::TestCase
  let(:user) { build(:user) }
  let(:empty_user) { build(:empty_user) }

  def user
    @user ||= build(:user)
  end

  def test_valid
    assert user.valid?
  end

  it 'should check if same password' do
    user.update(password: 'pa55w0rd', password_confirmation: 'password')
    assert_not user.valid?
  end

  it 'user can update password' do
    user.update(password: 'grapplepa55')
    user.reload
    user.password.must_equal 'grapplepa55'
  end

  it 'should not allow blank entry' do
    assert_not empty_user.valid?
  end
end
