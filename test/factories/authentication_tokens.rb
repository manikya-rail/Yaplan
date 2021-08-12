FactoryGirl.define do
  factory :authentication_token do
    body 'MyString'
    association :user, factory: :user
    last_used_at '2015-09-28 17:24:58'
    ip_address '92.168.3.45'
    user_agent 'MyString'
    factory :auth_token_no_user do
      user nil
    end
  end
end
