class V1::ActivitiesController < ApplicationController
  before_action :authenticate_user!
  def index
    total_count = 0
    activities = PublicActivity::Activity.where(id: collaborated_project_activities + personal_activites).includes(:recipient, :trackable, :owner).order(created_at: :desc)
    if params[:page].present?
      total_count = activities.count
      activities = activities.page(params[:page]).per(15)
    end
    render json: activities, root: 'activities', each_serializer: ActivityIndexSerializer,meta: { total_records: total_count }
  end

  def show
    activity = PublicActivity::Activity.find_by_id(params[:id])
    render json: activity, root: 'activities', each_serializer: ActivitySerializer
  end

  private

  def collaborated_project_tasks
    if params[:project_id].present?
      current_user.collaborated_projects.where(projects: { id: params[:project_id] }).collect(&:tasks).flatten |
        current_user.collaborated_documents.where(project_id: params[:project_id])
    else
      current_user.collaborated_projects.active | current_user.collaborated_documents.active | current_user.collaborated_projects.active.includes(:tasks).collect(&:tasks).flatten
    end
  end

  def collaborated_project_activities
      PublicActivity::Activity.where(recipient: collaborated_project_tasks).order(created_at: :desc).pluck(:id)
  end

  def personal_activites
      PublicActivity::Activity.where(recipient: current_user).order(created_at: :desc).pluck(:id)
  end
end
