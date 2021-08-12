class V1::CollaboratorsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_collaboration_object

  rescue_from ActiveRecord::RecordNotUnique, :with => :handle_unique_exception

  def index
    if @collaboration_object
      @collaborations = get_active_collaborations(@collaboration_object)
      @collaborations += get_active_collaborations(@collaboration_object.project) if @collaboration_object.is_a?(Document)
      @collaborations.uniq
      render json: @collaborations , root: "collaborators", each_serializer: CollaboratorSerializer
    else
      head :no_content
    end
  end

  def show
    render json: User.find(params[:id]), root: 'collaborator'
  end

  def create
    authorize! :invites, @collaboration_object
    if params[:invitations][:collaborators].present?
      invitor_message = params[:invitations][:message]
      params[:invitations][:collaborators].each do |collaborator|
        collaborator_name = collaborator[:name]
        email = collaborator[:email]
        user = User.collaboration_invite!(attributes: {invited_by: current_user, invitation_type: @collaboration_object,email: email,invitation_message: invitor_message,first_name: collaborator_name})
        if @collaboration_object.collaborators.include?(user)
          @collaboration_object.collaborations.find_by_collaborator_id(user).update(is_accepted: nil) #Reusing same collaboration object
        else
          @collaboration_object.collaborations.create(collaborator: user,invited_by_id: current_user.id)
        end
        @collaboration_object.create_activity(:invitation,owner: current_user,recipient: user)
        Analytics.identify(
          user_id: current_user.segment_id,
          traits: current_user.segment_traits
        )
        Analytics.track(user_id: current_user.segment_id, 
          event: "Invited User to #{@collaboration_object.class.name}",
          properties: {invitee_id: user.segment_id, invitee_name: user.full_name,
            invitee_email: email, invitor_message: invitor_message}
        )
        Analytics.track(user_id: user.segment_id, 
          event: "Got invited to #{@collaboration_object.class.name}", 
          properties: {invitor_id: current_user.segment_id, invitor_name: current_user.full_name,
            invitor_email: current_user.email, invitor_message: invitor_message}
        )
      end
      render json: { collaborators: @collaboration_object.collaborators }
    else
      render json: @collaboration_object,status: 404
    end
  end

  def get_user
    @user = User.find_by_email(params[:email]) 
    if @user.present?
      render json: @user, status: :ok, serializer: UserCollaboratorSerializer
    else
      render json: {user: nil}, status: :ok
    end
  end

  def search_collaborators
    @collaborators = current_user.find_collaborated_users(name: params[:name], email: params[:email])        
    render json: @collaborators, status: :ok, each_serializer: UserCollaboratorSerializer
  end

  def destroy
    if can? :manage, @collaboration_object
      @user = User.find_by_id(params[:user_id])
      email = @user.email
      if @user
        Collaboration.remove_collaboration(user: @user,collaboration_object: @collaboration_object)
        Analytics.track(
          user_id: current_user.segment_id,
          event: 'User Removed from #{collaboration_object.class_name}',
          properties: @collaboration_object.reporting_properties.merge({removed_user: @user.segment_traits})
          )
        Analytics.track(
          user_id: @user.segment_id,
          event: 'Got Removed from #{collaboration_object.class.name}',
          properties: @collaboration_object.reporting_properties.merge({removing_user: current_user.segment_traits})
          )
      end
      head :no_content
    end
  end

  protected

  def handle_unique_exception
    render json: { msg: 'Collaborator already exists.' }, status: 409
  end

  private
  def set_collaboration_object
    project_id = (params[:invitations][:project_id] if params[:invitations].present?) || params[:project_id]
    document_id = (params[:invitations][:document_id] if params[:invitations].present?) || params[:document_id]
    @collaboration_object = if project_id.present? 
                Project.find(project_id)
             elsif document_id.present?
                Document.find(document_id)
             end
  end

  def track(user:, event:, invitee:, invitee_email:, invetee_message: '')
    Analytics.track(
      user_id: user.segment_id,
      event: event,
      properties: @collaboration_object.reporting_properties.merge({
        invetee_email: invitee_email,
        invetee_message: invetee_message,
        invitee: invitee.segment_traits,
        })
      )
  end

  def get_active_collaborations(_obj)
    active_collaborators = _obj.collaborators.active
    selected_collaborators = if _obj.is_a?(Project) && _obj.try(:started?)
                      active_collaborators.where("collaborations.is_accepted = ?", true)
                    else
                      active_collaborators.where("collaborations.is_accepted = ? or collaborations.is_accepted is NULL", true)
                    end
    selected_collaborators.select("users.*, case collaborations.is_accepted when true then 'accepted' when false then 'rejected' else 'pending'  end as status")
  end
end