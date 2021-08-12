class Collaboration < ActiveRecord::Base
  enum permission_level: [:deny, :read, :write]

  validates :collaborator_id, presence: true

  scope :invitation_accepted, -> { where(is_accepted: true) }
  scope :invitation_not_accepted, -> { where(is_accepted: false) }
  scope :pending_invitations, -> { where(is_accepted: nil) }
 
  belongs_to :collaboration_level, polymorphic: true, optional: true
  belongs_to :collaborator, class_name: 'User', foreign_key: 'collaborator_id', optional: true
  belongs_to :invited_by, class_name: 'User', foreign_key: 'invited_by_id', optional: true

  def accept!
    update(is_accepted: true)
  end

  def reject!
    update(is_accepted: false)
  end

  def self.remove_collaboration(user: ,collaboration_object: )
    collaboration = where(collaborator: user,collaboration_level: collaboration_object).first
    NotificationMailer.new(collaboration).remove_collaborator if collaboration
    collaboration.destroy if collaboration
  end

  def self.is_already_responded?(collaboration_object: ,collaborator: ,collaboration_status: )
    where(
      collaboration_level: collaboration_object,
      is_accepted: collaboration_status,
      collaborator: collaborator
    ).present?
  end

end
