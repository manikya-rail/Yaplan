class ActivitySerializer < ActiveModel::Serializer
  attributes :id, :parameters, :text, :trackable_type, :recipient_type, :owner_type, :created_at, :key
  belongs_to :trackable
  belongs_to :recipient
  belongs_to :owner

  def text
  	I18n.t(
      object.key, full_name: object.try(:owner).try(:full_name),
      object_name: object.try(:trackable).try(:title)
    )
  end
end
