class Users::InvitationsController < Devise::InvitationsController
  skip_before_action :require_no_authentication, only: [:edit]
  before_action :update_sanitized_params, only: :update

  #for new user, change password first & then accepts invitation
  def edit
    get_collaboration_object
    if @user.present?
      if @collaboration_object.present?
        if @collaboration_object.accept_invitation(@user)
          unless @user.invitation_accepted?
            user_invite_activity = @collaboration_object.activities.where(key: "#{@collaboration_object.class.to_s.downcase}.invitation",recipient: @user)
            user_invite_activity.last.destroy  if user_invite_activity.present?
            @collaboration_object.create_activity(:accept,owner: @user,recipient: @collaboration_object)
            redirect_to accept_user_invitation_path(invitation_token: params[:invitation_token])
          end
        elsif password_not_set? && params[:invitation_token].present?
          redirect_to accept_user_invitation_path(invitation_token: params[:invitation_token])
        else
          redirect_to root_url
        end
      else    
        super
      end
    else
      redirect_to root_url
    end
  end

  def update
    super
  end

  private

  def after_accept_path_for(resource)
    root_url + "#/app/dashboard"
  end

  def get_collaboration_object
    @collaboration_object = if params[:invitation_type].to_s == 'document'
                              Document.find_by_id(params[:invitation_type_id])
                            elsif params[:invitation_type].to_s == 'project'
                              Project.find_by_id(params[:invitation_type_id])
                            end
  end

  def password_not_set?
    (@user.valid_password? "").nil?
  end

  def resource_from_invitation_token
    @user = User.find_by_invitation_token(params[:invitation_token], true)
  end

  def update_sanitized_params
    devise_parameter_sanitizer.for(:accept_invitation) << [:first_name,:last_name] 
  end

end
