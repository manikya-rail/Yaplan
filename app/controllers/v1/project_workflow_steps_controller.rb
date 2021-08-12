class V1::ProjectWorkflowStepsController < ApplicationController
  before_action :authenticate_user!

  def index
    if params[:project_id]
      project = current_user.all_collaborated_projects.find(params[:project_id])
      if (project.project_workflow)
        project_workflow_steps = project.project_workflow.project_workflow_steps
        render json: project_workflow_steps, include: '*.*', each_serializer: ProjectWorkflowStepSerializer
      else
        render json: ProjectWorkflowStep.none
      end
    else
      render json: ProjectWorkflowStep.none
    end
  end

  def create
    step = ProjectWorkflowStep.new(step_update_params)
    if step.save
      render json: step, status: :created
    else
      render json: step.errors.full_messages, status: :unprocessable_entity
    end
  end

  def update
    set_step
    if @step.update(step_update_params)
      render json: @step, status: :created
    else
      render json: @step.errors.full_messages, status: :unprocessable_entity
    end
  end

  def set_assignee
  	set_step
  	task = @step.task
  	if task.update(task_update_params)
  		render json: @step, status: :created
  	else
  		render json: task.errors.full_messages, status: :unprocessable_entity
  	end
  end

  def create_communications
    step = ProjectWorkflowStep.find(params[:id])
  end


  private

  def set_step
  	@step = ProjectWorkflowStep.find(params[:id])
  end

  def step_update_params
    filtered_params = params.require(:project_workflow_step).permit!
    filtered_params.delete(:_destroy)
    filtered_params
  end

  def task_update_params
  	params.require(:project_workflow_step).permit!
  end
end
