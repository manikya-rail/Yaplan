FactoryGirl.define do
  factory :section_container do
    document
    association :section_text, factory: :numbered_section_text
    created_at Time.now - 5.days
  end
end
