class Users::SessionsController < Devise::SessionsController
  include SignIn
  respond_to :json
  # before_action :configure_sign_in_params, only: [:create]

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  # def create
  #   super
  # end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.for(:sign_in) << :attribute
  # end

  # Test with the following:
  # curl -v localhost:3000/users/sign_in -X POST -H "Accept: application/json" -H "Content-Type: application/json"
  # -d  '{ "user": {"email":"me@email.com", "password":"aaaaaaaa"}}'
  def create
    puts 'CREATING SESSION ------------------------------------------------------------'
    respond_to do |format|
      format.html  do
        super
      end
      format.json do
        # new_auth_options = {:scope => resource_name, :store => !(request.format.xml? || request.format.json?)}.merge(auth_options)
        # Don't understand why request.format.json is not set to true.
        # Also, this presumably does not matter, we are not storing anything in the session regardless.
        # user = warden.authenticate!(new_auth_options)
        user = warden.authenticate!(auth_options)
        puts 'USER JSON AUTHENTICATED ------------------------------------------------------------'
        if current_user.sign_in_count == 1
          Document.generate_templates_for(current_user)
          puts 'USER TEMPLATE ADDED ------------------------------------------------------------'
        end
        Analytics.identify(
          user_id: user.segment_id,
          traits: user.segment_traits
        )
        Analytics.track(
          user_id: user.segment_id,
          event: 'Sign in'
        )
        return render json: sign_in_data(user, request).to_json
      end
    end
  end

  def failure
    render json: { success: false, errors: ['Login information is incorrect, please try again'] }
  end

  def destroy
    Analytics.track(
      user_id: current_user.segment_id,
      event: 'Sign out'
    ) unless current_user.nil?
    respond_to do |format|
      format.html { super }
      format.json do
        Tiddle.expire_token(current_user, request) if current_user
        render json: {}
      end
    end
  end

  protected

  def after_sign_in_path_for(user)
   user.admin? ? admin_dashboard_path : root_path  unless request.xhr?
  end

  private

  # this is invoked before destroy and we have to override it
  def verify_signed_out_user
  end
end
