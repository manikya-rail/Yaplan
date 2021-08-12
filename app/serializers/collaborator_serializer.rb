class CollaboratorSerializer < ActiveModel::Serializer
  attributes :id, :full_name, :email, :status
end
