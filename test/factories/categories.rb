FactoryGirl.define do
  factory :category do
    name 'IT'
    image nil
    factory :category_without_name do
      name nil
    end
  end
end
