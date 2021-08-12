FactoryGirl.define do
  sequence(:email) { |n| "person#{n}@example.com" }
  factory :user do
    full_name 'John Doe'
    email 'me@test.tes'
    password '11111111'
    confirmed_at Time.now
    role_id { Role.find_by_name('normal_user').id }
    initialize_with { User.find_or_create_by(email: email) }
  end

  factory :another_user, class: User do
    full_name 'Jane Smith'
    email
    password '11111111'
    role_id { Role.find_by_name('normal_user').id }
  end

  factory :collab_user, class: User do
    full_name 'Collab Orator'
    email
    password '111111'
  end

  factory :empty_user, class: User do
    full_name ''
    email ''
    password ''
  end

  factory :admin_user, class: User do
    full_name 'Admin Guy'
    email 'admin123@grapple.pm'
    password 'admin123'
    role_id { Role.find_by_name('admin').id }
    initialize_with { User.find_or_create_by(email: email) }
  end
end
