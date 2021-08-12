class PlanSerializer < ActiveModel::Serializer
  attributes :id, :name, :project_count, :amount
  has_many :users, include: '*'
end
