=begin
FactoryGirl.define do
  sequence(:category)

  sequence :content_category_item_title do |n|
    "Factory Item #{n} title"
  end

  factory :content_category_item do
    title { generate(:content_category_item_title)}
    project_content_category
# content {}.to_json



    factory :empty_project_content_category, class: ProjectContentCategory do
      title 'Category Title'
      category
      project

      factory :project_content_category do
        content_item_attributes ({'1' => { 'name' => 'author', 'type' => 'String'}})

        factory :project_content_category_with_three_items do
          content_item_attributes ({'1' => { 'name' => 'author', 'type' => 'String'},
                                    '2' => { 'name' => 'price', 'type' => 'Fixnum' },
                                    '3' => { 'name' => 'value', 'type' => 'Fixnum' }
                                  })
        end
      end

    end
  end



  # project_with_content will create content categories, and items for these after the project has been created
  factory :content_category_with_items, parent: :project_content_category do
    # items_count is declared as a transient attribute and available in
    # attributes on the factory, as well as the callback via the evaluator
    transient do
      items_count 3
    end

    # the after(:create) yields two values; the project_content_category instance itself and the
    # evaluator, which stores all values from the factory, including transient
    # attributes; `create_list`'s second argument is the number of records
    # to create and we make sure the project_content_category is associated properly to the content_category_item
    after(:create) do |project_content_category, evaluator|
      create_list(:content_category_item, evaluator.items_count, project_content_category: project_content_category)
    end
  end
end
=end
