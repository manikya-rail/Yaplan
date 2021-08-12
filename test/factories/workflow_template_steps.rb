FactoryGirl.define do
  factory :workflow_template_step do
    node { { name: 'Document 2', id: 1 } }
    node_type 'Document'
  end
end
