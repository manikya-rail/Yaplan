class DocumentCoverSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :category_name,:archived, :project_id, :project_name, :proposed_startdate, :proposed_enddate, :created_at, :updated_at, :state, :is_public, :is_template,:cover_page,:header,:footer, :logo, :subtitle, :show_contents, :show_cover, :assigned_to_id, :approver_id, :type, :published
  belongs_to :created_by, serializer: UserCollaboratorSerializer
  belongs_to :approver, serializer: UserCollaboratorSerializer
  belongs_to :project, serializer: OptProjectSerializer
  belongs_to :assigned_to, serializer: UserCollaboratorSerializer

  def is_template
    object.is_template?
  end

  def project_name
  	object.project.title if object.project.present?
  end

  def category_name
    object.project.category.name if object.project.present?
  end

end
