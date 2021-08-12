class ApplicationController < ActionController::Base
  respond_to :json, :html
  before_action :set_paper_trail_whodunnit

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # 2015/10/01. We are going with
  # - cookie on ember page, to create a session
  # - sending CSRF token on all requests, done by ember in authorizer/custom.js
  # - browser submits the session cookie, which allows the back-end to match the CSRF token to the session
  #   CSRF token by itself will not be accepted, it needs the session with it.
  # - however, we drop/skip the session on these json requests once received, we don't want it.
  #   (Dropping the session is important, it ensures the authentication is done through the token,
  #    not through the session cookie)
  # This may be an overkill. The authentication token is sent on all requests,
  # and this may be sufficient to prevent CSRF attacks, if the user is authenticated.
  # It wouldn't cover the cases where the user is not yet authenticated.
  #
  # TL;DR: session cookie + CSRF is there to protected unauthenticated POSTS, very limited
  # Don't remove the session :drop on JSON requests, otherwise authentication falls back on cookie auth
  #

  # TODO: improve on this:
  # We disabling CFRF token checks to allow change password to work and other submissions to work.
  # Short term fix, we should update the CSRF token on the front-end after login, and after logout
  # It also does not work on some cases on the API, most likely because
  # protect_from_forgery with: :exception
  before_action :use_dummy_session_for_json_requests

  rescue_from CanCan::AccessDenied do |exception|
    respond_to do |format|
      format.json { render json: 'You are not Authorized to do this action', status: :forbidden }
      format.html { redirect_to root_url, alert: exception.message }
    end
  end

  def index
    # See https://github.com/rwz/ember-cli-rails for details on how to run with Ember
    render :index, layout: false
  end

  private

  def authenticate_as_admin!
    raise CanCan::AccessDenied unless current_user.try(:admin?)
  end

  def use_dummy_session_for_json_requests
    # See introduction above on the reasons of this code.
    return unless request.format.xml? || request.format.json?
    ENV['rack.session.id'] = '1000' # used to avoid generate_sid()
    # could also use :skip instead of :drop
    ENV['rack.session.options']['drop'] = true if ENV['rack.session.options']
  end
end
