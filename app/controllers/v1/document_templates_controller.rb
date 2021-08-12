class V1::DocumentTemplatesController < ApplicationController
  before_action :authenticate_user!
  respond_to :json

  api :GET, 'v1/document_templates', 'Returns all document templates from this user. Document dependencies are included.'
  def index
    category = Category.find( params[:category_id] ) if params[:category_id].present?
    @document_templates_count = 0
    @document_templates = TemplateService.new.get_document_templates(
      user: current_user, category: category, archived: !(!params[:archived]), is_public: params[:is_public]
    )
    if params[:q].present?
      @document_templates = @document_templates.search(params[:q])
    end
    if params[:page].present?
      @document_templates_count = @document_templates.count
      @document_templates = @document_templates.page(params[:page]).per(15)
    end
    render json: @document_templates.recent, root: 'document_templates', each_serializer: DocumentTemplateSerializer, meta: { total_records: @document_templates_count }
  end

  def archived_count
    render json: TemplateService.new.get_document_templates(
      user: current_user, archived: true
    ).count
  end

  api :GET, 'v1/document_templates/1', 'Returns the content of this document, including the sections containers and their content'
  def show
    document_template = Document.find(params[:id])
    authorize! :show, document_template
    Analytics.track(
      user_id: current_user.segment_id,
      event: 'Document template viewed',
      properties: { template_id: params[:id] }
    )

    render json: document_template, include: json_children
  end

  api :POST, 'v1/document_templates', 'Creates a new template from the provided document'
  param :document_id, :number
  def create
    template = if document_template_params[:category_id].present? # If template is created from new document
                 category = Category.find(document_template_params[:category_id])
                 TemplateService.new.create_template_from_new(user: current_user, category: category)
              elsif document_template_params[:document_id].present?
                 document = Document.find(document_template_params[:document_id]) # If an existing document is duplicated
                 authorize! :read, document
                 TemplateService.new.create_template_from_existing(user: current_user, document: document)
              end
    if template.save
      Analytics.track(
        user_id: current_user.segment_id,
        event: 'Document template created',
        properties: reporting_properties_of(template)
      )
      render json: {message: template, include: json_children, status: :created, location: [:v1, template]}
    else
      render json: {message: template.errors.full_messages, status: :unprocessable_entity}
    end
  end

  api :DELETE, 'v1/document_templates/1', 'Archives this document template'
  def destroy
    template = Document.find_by_id(params[:id])
    authorize! :destroy, template
    template.archive!
    Analytics.track(
      user_id: current_user.segment_id,
      event: 'Document template archived',
      properties: reporting_properties_of(template)
    )
    render json: template, include: json_children
  end

  def unarchive
    template = Document.find_by_id(params[:id])
    authorize! :destroy, template
    template.un_archive!
    Analytics.track(
      user_id: current_user.segment_id,
      event: 'Document template Unarchived',
      properties: reporting_properties_of(template)
    )
    render json: template, include: json_children
  end

  private

  def reporting_properties_of(template)
    category = template.project.category
    template.reporting_properties.except(:project).merge(category: category.name)
  end

  def document_template_params
    params.require(:document_template).permit(:category_id, :document_id, :title, :approver_id, :state)
  end

  # Include in the serializer does not seem to work. Including through the controller
  def json_children
    ['project', 'project.category']
  end
end
