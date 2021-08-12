class UserCollaboratorSerializer < ActiveModel::Serializer
  attributes :id, :full_name, :email
  has_one :portrait
end
