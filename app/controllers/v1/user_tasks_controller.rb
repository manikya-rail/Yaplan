class V1::UserTasksController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource
  skip_authorize_resource only: :index
  before_action :set_task,except: :index
  before_action :set_default_params, only: :index

  def index
    # it will fetch active task for response_status nil value
    options = {}
    if params[:response_status]
      status = params[:response_status].is_a?(Array) ? params[:response_status].map { |ut| UserTask.response_statuses[params[:response_status]] } : params[:response_status]
      options.merge!(response_status: status)
    end
    if params[:project_id]
      options.merge!(tasks: { project_id: params[:project_id] })
      user_tasks = current_user.user_tasks.recent.joins(:task).where(options)
    else
      accepted_project_id = current_user.collaborated_projects.where(collaborations: {is_accepted: true }).pluck(:id)
      user_tasks = current_user.user_tasks.recent.where(options).joins(task: :project).where(
        projects: { archived: false },
        tasks: {project_id: accepted_project_id }
      ) 
    end
    render json: user_tasks.uniq, root: 'user_tasks'
  end

  def show
    authorize! :read, @user_task
    render json: @user_task
  end

  def accept_task
    authorize! :update, @user_task
    @user_task.set_as_accepted!
    render json: @user_task, status:  :ok
  end

  def reject_task
    authorize! :update, @user_task
    @user_task.response_message = params[:message]
    @user_task.set_as_rejected!
    render json: @user_task, status: :ok
  end

  def destroy
    authorize! :delete, @user_task
    @user_task.destroy
    render json: @user_task, status: :ok
  end

private


  def set_task
    @task ||= @user_task.task
  end


 def set_default_params
  params[:response_status] = UserTask.response_statuses[params[:response_status]] if params[:response_status].present?
 end 
end
