FactoryGirl.define do
  factory :collaboration do
    collaboration_level nil
    association :collaborator, factory: :user
    permission_level 1
    factory :collaboration_without_collaborator do
      collaborator nil
    end
  end
end
