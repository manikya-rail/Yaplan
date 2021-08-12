class V1::CollaborationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_filter_params

  def index
    collaborations = Collaboration.where(@filter_params).where.not(collaborator: current_user)
    render json: collaborations
  end

  def show
    collaboration = Collaboration.find(params[:id])
    render json: collaboration, status: :created
  end

  def get_pending_invitations
    collaboration_invitations = PublicActivity::Activity.includes(:recipient, :trackable, :owner)
                                .where(recipient: current_user)
                                .where("key = 'project.invitation' or key = 'document.invitation'")
    render json: collaboration_invitations, status: :created, each_serializer: ActivityIndexSerializer, root: "activities"
  end
private
  
  def set_filter_params
    @filter_params = {}
    if params[:project_id]
      @filter_params[:collaboration_level_type] = 'Project'
      @filter_params[:collaboration_level_id] = params[:project_id]
    end
  end
end
