class ActivityIndexSerializer < ActiveModel::Serializer
  attributes :id, :parameters, :text, :trackable_type, :trackable, :recipient_type, :recipient, :owner_type, :owner, :created_at, :key
  # belongs_to :trackable
  # belongs_to :recipient
  #belongs_to :owner, serializer: UserCollaboratorSerializer

  def text
    I18n.t(
      object.key, full_name: object.try(:owner).try(:full_name),
      object_name: object.try(:trackable).try(:title)
    )
  end

  def owner
    { id: object.owner.id, full_name: object.owner.full_name, email: object.owner.email } if object.owner.present?
  end

  def trackable
    { id: object.trackable.id , title: object.trackable.title } if object.trackable.present?
  end

  def recipient
    { id: object.recipient.id } if object.recipient.present?
  end

end
