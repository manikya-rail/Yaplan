  class V1::WorkflowTemplatesController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :workflow_params
  skip_authorize_resource only: [:index, :create]

  api :GET, 'v1/workflow_templates/:category_id', 'Returns all active workflows of a category.'
  def index
    template_total_count = 0
    if current_user.admin?
      workflow_templates = WorkflowTemplate.active.recent.where(
        created_by: current_user
      )
    else
      workflow_templates = WorkflowTemplate.active.recent.where(
        '(workflow_templates.is_public = false and workflow_templates.created_by_id = ?) or workflow_templates.is_public = true',
        current_user.id
      )
    end
    if params[:category_id]
      workflow_templates = workflow_templates.where(
        category_id: params[:category_id]
      )
    end
    if params[:published]
      workflow_templates = workflow_templates.active.published
    end
    if params[:q]
      options = {}
      options.merge!({search: params[:q]}) if params[:q].present?
      workflow_templates = workflow_templates.search(options)
    end
    if params[:document_template_id]
      workflow_templates = workflow_templates.search_by_document_tempate(
        document_template_id: params[:document_template_id]
      )
      render json: workflow_templates, each_serializer: WorkflowTemplateIndexSerializer, meta: { total_records: template_total_count }
    else
      if params[:page].present?
        template_total_count = workflow_templates.count
        workflow_templates = workflow_templates.page(params[:page]).per(15)
      end
      render json: workflow_templates, include: '*.*', each_serializer: WorkflowTemplateIndexSerializer, meta: { total_records: template_total_count }
    end
  end

  api :GET, 'v1/workflow_templates/:id', 'Returns all active workflow_templates of a category.'
  def show
    render json: {message: @workflow_template, serializer: WorkflowTemplateSerializer, include: '*.*.*'}
  end

  api :POST, 'v1/workflow_templates', 'Create workflow_templates under a category.'
  def create
    set_category
    workflow_template = WorkflowTemplate.new(workflow_params)
    if workflow_template.save(:validate => false)
      Analytics.track(
        user_id: current_user.segment_id,
        event: 'Workflow template created',
        properties: workflow_template.reporting_properties
        )
      render json: {message: workflow_template, include: '*.*.*', status: :created}
    else
      render json: {error_message: workflow_template.errors.full_messages, status: :unprocessable_entity}
    end
  end

  def update
    if @workflow_template.update(workflow_update_params)
      head :no_content
    else
      render json: @workflow_template.errors.full_messages, status: :unprocessable_entity
    end
  end

  api :DELETE, 'v1/workflow_templates/:id', 'Archive a workflow'
  def destroy
    @workflow_template.archive!
    render json: @workflow_template, status: :created
  end

  api :POST, 'v1/workflow_templates/:id', 'Un archive a workflow'
  def unarchive
    @workflow_template.un_archive!
    render json: @workflow_template, status: :created
  end

  api :POST, 'v1/workflow_templates/:id/publish', 'To publish workflow'
  def publish
    @workflow_template.publish!
    render json: @workflow_template, status: :created
  end

  private

  def set_category
    if params[:category_id]
      @category ||= Category.find(params[:category_id])
    end
  end

  def workflow_params
    params.require(:workflow_template).merge!(created_by_id: current_user.id).permit!
  end

  def workflow_update_params
    params.require(:workflow_template).permit!
  end
end
