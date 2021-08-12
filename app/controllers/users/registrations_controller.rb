class Users::RegistrationsController < Devise::RegistrationsController
  include SignIn
  # See the below for creating accounts with no passwords, and password to be set by the user afterwards
  # https://github.com/plataformatec/devise/wiki/How-To:-Override-confirmations-so-users-can-pick-their-own-passwords-as-part-of-confirmation-activation

  # before_action :configure_permitted_parameters
  before_action :configure_permitted_parameters, if: :devise_controller?

  api :POST, 'v1/users', 'Creates a new user. In case of success, logs '\
   'the user in and resturns token and email need to be provided in the '\
    'header of authenticated requests'
  param :user, Hash, desc: 'User container', required: true do
    param :email, String, desc: 'Must be unique', required: true
    param :first_name, String, desc: 'First name of the user, e.g. John', required: true
    param :last_name, String,  desc: 'Last name of the user, e.g. John',  required: true

  end
  def create
    user = User.new(user_params)
    if user.save
      Analytics.identify(
        user_id: user.segment_id,
        traits: user.segment_traits
      )
      Analytics.track(
        user_id: user.segment_id,
        event: 'Sign up',
        properties: {
          user_name: user.full_name,
          user_email: user.email
        }
      )
      if user.active_for_authentication?
        set_flash_message :notice, :signed_up if is_navigational_format?
        return render json: { success: true, payload: sign_in_data(user, request) }.to_json
      else
        set_flash_message :notice, :"signed_up_but_#{user.inactive_message}" if is_navigational_format?
        expire_data_after_sign_in!
        return render json: { success: true, payload: sign_in_data(user, request) }.to_json
      end
    else
      clean_up_passwords user
      return render json: { success: false, errors: user.errors.messages }
    end
  end

  
  def update
    super
  end

  protected

  def user_params
    params.require(:user).permit(:first_name,:last_name, :email, :password, :password_confirmation)
  end

  # def configure_permitted_parameters
  #   devise_parameter_sanitizer.for(:account_update) << [:first_name,:last_name]## add the attributes you want to permit
  # end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name])
  end

end

# before_action :configure_sign_up_params, only: [:create]
# before_action :configure_account_update_params, only: [:update]

# GET /resource/sign_up
# def new
#   super
# end

# POST /resource
# def create
#   super
# end

# GET /resource/edit
# def edit
#   super
# end

# PUT /resource
# def update
#   super
# end

# DELETE /resource
# def destroy
#   super
# end

# GET /resource/cancel
# Forces the session data which is usually expired after sign
# in to be expired now. This is useful if the user wants to
# cancel oauth signing in/up in the middle of the process,
# removing all OAuth session data.
# def cancel
#   super
# end

# protected

# If you have extra params to permit, append them to the sanitizer.
# def configure_sign_up_params
#   devise_parameter_sanitizer.for(:sign_up) << :attribute
# end

# If you have extra params to permit, append them to the sanitizer.
# def configure_account_update_params
#   devise_parameter_sanitizer.for(:account_update) << :attribute
# end

# The path used after sign up.
# def after_sign_up_path_for(resource)
#   super(resource)
# end

# The path used after sign up for inactive accounts.
# def after_inactive_sign_up_path_for(resource)
#   super(resource)
# end
