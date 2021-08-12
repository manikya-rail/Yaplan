FactoryGirl.define do
  factory :section_text do
    title 'Section title'
    content 'This is our lovely text, including some <br>html</br> tags.'
    association :created_by, factory: :user
    association :project
  end

  sequence(:section_number_variable)

  factory :numbered_section_text, class: SectionText do
    transient do
      section_count { generate(:section_number_variable) }
    end

    title { "Section #{section_count} title" }
    content { "This is the lovely content of section #{section_count} with some <br>html</br> tags." }
    association :created_by, factory: :user
    association :project
  end
end
