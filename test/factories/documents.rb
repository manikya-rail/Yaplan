FactoryGirl.define do
  factory :document do
    title 'Document Title'
    association :created_by, factory: :user
    association :assigned_to, factory: :another_user
    association :project, factory: :project

    factory :document_with_sections do
      created_at Time.now - 7.days
      # items_count is declared as a transient attribute and available in
      # attributes on the factory, as well as the callback via the evaluator
      transient do
        sections_count 2
      end

      # the after(:create) yields two values; the document instance itself and the
      # evaluator, which stores all values from the factory, including transient
      # attributes; `create_list`'s second argument is the number of records
      # to create and we make sure to setup the associations correctly
      after(:create) do |document, evaluator|
        create_list(:section_container, evaluator.sections_count, document: document)
      end

      factory :unrelated_document do
        association :created_by, factory: :another_user
        project { create(:other_project, created_by: created_by) }
      end

      factory :document_template do
        project { TemplateService.new.document_template_project(user: created_by, category: create(:category)) }
      end

      factory :document_template_from_another_user do
        association :created_by, factory: :another_user
        project { TemplateService.new.document_template_project(user: created_by, category: create(:category)) }
      end
    end
  end
end
