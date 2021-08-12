class DocumentTemplateSerializer < ActiveModel::Serializer
	#For Document Templates Index action
	attributes :id, :title, :description, :category_name,:archived, :project_id, :project_name, :created_at, :updated_at, :state, :is_public, :is_template, :published
	belongs_to :created_by, serializer: UserCollaboratorSerializer
	belongs_to :project, serializer: OptProjectSerializer

	def is_template
		object.is_template?
	end

	def category_name
		object.project.category.name if object.project.present?
	end

	def project_name
		object.project.title if object.project.present?
	end
end
