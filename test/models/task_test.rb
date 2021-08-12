require 'test_helper'

class TaskTest < ActiveSupport::TestCase

  def task
    @task ||= Task.new
  end

  def test_valid
    assert task.valid?
  end

  it 'Should create user tasks for action' do
    task = create(:task)
    task.set_as_assigned!
    task.assigned_to_id.must_equal task.user_tasks.last.user_id
  end

  it 'should Update corresponding workflow step status '	do
  end

  it 'Assigned user can only update publish status' do

  end

  it 'Assigned user can only update Approve status' do
  end

  it 'Assigned user can only access task' do
  end
end
