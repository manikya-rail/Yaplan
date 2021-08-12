class V1::TasksController < ApplicationController
  before_action :set_project
  def index
    if params[:type]
      @tasks = Task.active.where(project_id: params[:project_id], type: params[:type]).recent
      if params[:include_templates]
        @tasks = (@tasks | TemplateService.new.get_document_templates(user: current_user, is_public: true)).to_a.sort_by(&:updated_at).reverse
      end
    elsif @project.project_workflow
      @tasks = @project.project_workflow.tasks.recent
    else
      @tasks = Task.none
    end
    render json: @tasks, each_serializer: TaskSerializer, root: 'tasks'
  end

  private

  def set_project
    @project = current_user.all_collaborated_projects.find(params[:project_id])
  end
end
