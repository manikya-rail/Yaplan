class CollaborationSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :user_name, :user_email, :is_accepted, :invited_by, :permission_level, :status, :project_access, :document_access, :role
  # has_one :collaboration_level
  # has_one :collaborator

  def invited_by
    object.invited_by.full_name if object.invited_by.present?
  end

  def user_id
    object.collaborator.id if object.collaborator.present?
  end

  def user_name
    object.collaborator.full_name if object.collaborator.present?
  end

  def role
    (project_access && (object.collaboration_level.created_by == object.collaborator)) ? "Project Manager" : "User"
  end

  def user_email
    object.collaborator.email if object.collaborator.present? 
  end

  def status
    if !(object.is_accepted.nil?)
      object.is_accepted ? "Accepted" : "Rejected" 
    else
      "Pending"
    end
  end

  def project_access
    object.collaboration_level.is_a?(Project)
  end

  def document_access
    unless project_access
      project_id = object.collaboration_level.project.id
      arr = []
      object.collaborator.collaborated_documents.where(project_id: project_id).each do |doc|
        accessible = doc.can_access?(current_user)
        status = doc.collaborations.where(collaborator_id: user_id).last.is_accepted
        arr << { id: doc.id, title: doc.title, status: status, accessible: accessible }
      end
      arr.empty? ? nil : arr
      # accessible = object.collaboration_level.can_access?(current_user)
      # { id: object.collaboration_level.id, title: object.collaboration_level.title, accessible: accessible }
    end
  end
end
