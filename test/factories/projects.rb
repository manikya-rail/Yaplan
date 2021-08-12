FactoryGirl.define do
  factory :project do
    title 'Project Title'
    association :created_by, factory: :user
    template_status Project::REGULAR_PROJECT
    association :category, factory: :category
    initialize_with { Project.find_or_create_by(title: 'Project Title') }
  end

  factory :other_project, class: Project do
    title 'Other Project'
    template_status Project::REGULAR_PROJECT
    association :category, factory: :category
    association :created_by, factory: :user
  end
end
