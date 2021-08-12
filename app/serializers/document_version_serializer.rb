class DocumentVersionSerializer < ActiveModel::Serializer
	attributes :id, :title, :description, :proposed_startdate, :created_at, :updated_at, :project_id, :state, :is_public,:cover_page,:header,:footer, :logo, :subtitle, :assigned_to_id, :approver_id
	has_many :section_texts
	has_many :images
end