FactoryGirl.define do
  factory :role, class: Role do
    name 'user'
    initialize_with { Role.find_or_create_by(name: 'user') }
  end

  factory :admin_role, class: Role do
    name 'admin'
    initialize_with { Role.find_or_create_by(name: 'admin') }
  end

  factory :support_role, class: Role do
    name 'support'
    initialize_with { Role.find_or_create_by(name: 'support') }
  end
end
