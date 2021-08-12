FactoryGirl.define do
  factory :project_workflow_step do
    step_id 1
    project_workflow nil
    state ''
    next_step_id 1
    node_type 'MyString'
    node ''
  end
end
