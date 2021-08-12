class TemplateService
  TEMPLATE_PROJECT_NAME= 'Document Templates'

  # All Template documents are held in a dedicated project
  def create_document_template_project(user:, category:)
    Project.create(
               created_by: user,
               title: TEMPLATE_PROJECT_NAME,
               template_status: Project::DOCUMENT_TEMPLATE,
               category: category 
            )
  end

  def document_template_project(user:, category: nil)
    Project.where(created_by: user,template_status: Project::DOCUMENT_TEMPLATE,category: category).take || create_document_template_project(user: user, category: category)
  end

  # #returns current user's templates + admin's published templates
  def get_document_templates(user:, category: nil, archived: false, is_public: false)
    options = {template_status: Project::DOCUMENT_TEMPLATE}
    options.merge!({category_id: category.id}) if category.present?
    public_options = {is_public: true} if (is_public && user.admin?)
    owned_templates = 
      Document.joins(:project).where(
        projects: options.merge({ created_by_id: user.id }),
        archived: archived
      )
    template_ids = 
      if archived
        owned_templates.pluck(:id)
      else
        owned_templates.where(public_options).pluck(:id) + Document.public_templates.pluck(:id)
      end
    Document.where(id: template_ids).includes(:created_by,project: [:category])
  end

  def create_template_from_existing(user:, document:)
    category = document.project.category
    template = document.duplicate(project: document_template_project(user: user, category: category), created_by: user)
    template.state = 0
    template.assigned_to_id = nil
    template.approver_id = nil
    template
  end

  def create_template_from_new(user:,category:)
    project = TemplateService.new.document_template_project(user: user, category: category)
    template = Document.new(title: "New Document Template for #{category.name}",created_by: user, project: project)
    template
  end

end
