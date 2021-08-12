FactoryGirl.define do
  factory :task do
    association :assigned_to, factory: :user
    association :approver, factory: :another_user
    type 'Document'
    association :project, factory: :project
    state :created
    title "Document 1"
    association :created_by, factory: :user
  end
  factory :decision_task do
    association :assigned_to, factory: :user
    association :approver, factory: :user
    type 'Decision'
    association :project, factory: :project
    state :created
    title 'Decision 1'
    association :created_by, factory: :another_user
  end
end
