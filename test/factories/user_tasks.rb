FactoryGirl.define do
  factory :document_user_task do
    association :user, factory: :user
    association :task, factory: :task
    task_type 2
    response_status :nil
  end
  factory :decision_user_task do
    association :user, factory: :user
    association :task, factory: :decision_task
    task_type 1
    response_status nil
  end
  factory :user_task do
    association :user, factory: :user
    association :task, factory: :task
    task_type 1
    response_status nil
  end
end
