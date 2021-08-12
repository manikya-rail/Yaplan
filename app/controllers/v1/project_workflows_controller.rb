class V1::ProjectWorkflowsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :workflow_params, except: [:create]
  skip_authorize_resource only: [:index, :create]
  before_action :set_project

  def index
    if @project.present?
      authorize! :read, @project
      project_workflow = @project.project_workflow
      if project_workflow.present?
        render json: project_workflow, include: '*.*.*.*', root: "project_workflow", serializer: ProjectWorkflowSerializer
      else
        render json: { project_workflow: nil }
      end
    else
      options = {}
      options.merge!({search: params[:q]}) if params[:q].present?
      project_workflows = ProjectWorkflow
                            .where(project: collaborated_projects.active)
                            .includes(:category, :created_by, project: [:created_by,:category])
                            .select('project_workflows.*', 'categories.name', 'users.*', 'projects.title as project_name')
                            .references(:category, :created_by, :project).search(options)
      if params[:page].present?
        render json: project_workflows.page(params[:page]).per(15), each_serializer: ProjectWorkflowIndexSerializer, meta: { total_records: project_workflows.to_a.size }
      elsif params[:document_id]
        project_workflows = project_workflows.search_by_document(document_id: params[:document_id])
        render json: project_workflows, each_serializer: ProjectWorkflowListSerializer
      else
        render json: project_workflows, each_serializer: ProjectWorkflowIndexSerializer
      end
    end

  end

  def create
    authorize! :manage, @project
    get_workflow_template
    project_workflow = ProjectWorkflow.new(project_workflow_params)
    if project_workflow.save
      render json: project_workflow, status: :created
    else
      render json: project_workflow.errors.full_messages, status: :unprocessable_entity
    end
  end

  def show
    authorize! :manage, @project_workflow
    render json: @project_workflow, include: '*.*.*.*', status: :created
  end

  def set_lock
    authorize! :lock, @project_workflow
    @project_workflow.update_lock!
    WorkflowNotificationMailer.new(@project_workflow).triggered_workflow_lock.deliver_now!
    render json: @project_workflow, status: :created
  end

  def destroy
    authorize! :delete, @project_workflow
    @project_workflow.destroy
    head :no_content
  end

  def update #now not using  - Need it for future
    authorize! :manage, @project_workflow
    if @project_workflow.update(project_workflow_params)
      WorkflowNotificationMailer.new(@project_workflow).workflow_updated.deliver_later!
      head :no_content
    else
      render json: @project_workflow.errors.full_messages, status: :unprocessable_entity
    end
  end

  def save_as_template
    authorize! :manage, @project_workflow
    @project_workflow.save_as_template
    render json: @project_workflow, status: :created
  end

  private

  def collaborated_projects
    current_user.collaborated_projects
  end

  def project_workflow_params
    params.require(:project_workflow).permit! # disabling strong params for handle dynamic hash values
  end

  def get_workflow_template
    @workflow_template = WorkflowTemplate.find_by_id(params[:workflow_template_id])
  end

  def set_project
    if params[:project_id]
      project_id = params[:project_id]
    elsif params[:project_workflow] && params[:project_workflow][:project_id]
      project_id = params[:project_workflow][:project_id]
    end
    @project = Project.find_by(id: project_id)
  end
end
