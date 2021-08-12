FactoryGirl.define do
  factory :workflow_template do
    name 'Sample Workflow 1'
    association :category, factory: :category
    structure {}
  end
end
