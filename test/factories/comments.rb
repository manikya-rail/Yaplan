FactoryGirl.define do
  factory :comment do
    comment_text 'Comment text 1'
    commentable nil
    association :commenter, factory: :user
    parent_comment_id nil

    factory :empty_text_comment do
      comment_text nil
    end

    factory :comment_without_commenter do
      commenter nil
    end
  end
end
