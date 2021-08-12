require 'test_helper'

class UserTaskTest < ActiveSupport::TestCase
  let(:user) { create(:user) }
  let(:another_user) { create(:another_user) }
  let(:task) { build(:task) }
  let(:user_task) { build(:user_task) }

  def test_valid
    assert user_task.valid?
  end

  it 'Should create a user_task' do
    user_task = task.create(:user_task)
    task.user_tasks.include?(user_task)
  end

  it 'Should assign to user tasks' do
    user_task = task.create(:user_task, user: user)
    user_task.user.id.must_equal user.id
  end

  it 'Should return user tasks' do
    user_task = task.create(:user_task, user: user)
    user.user_tasks.include?(user_task)
  end

  it 'Other user cannot respond to user_task' do
    ability = Ability.new(another_user)
    another_user_task = task.create(:user_task, user: user)
    assert ability.cannot?(:change_state, another_user_task)
  end

  it 'Assigned user can only respond to user_task' do
    ability = Ability.new(user)
    user_task = task.create(:user_task, user: user)
    assert ability.can?(:change_state, user_task)
  end

  it 'Create User notification' do
    skip # TODO: Add notification
  end
end
