class V1::PortraitsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource
  skip_load_resource only: :destroy

  api :POST, 'v1/portraits', 'Add new/change portrait to user'
  param :user_id, String, desc: 'User ID of current user'
  param :image, String, desc: 'Base64 encoded file'
  def create
    if current_user.portrait.present?
      @portrait = Portrait.find_by_user_id(params[:portrait][:user_id])
      if @portrait.update(portrait_params)
        NotificationMailer.new(@portrait).avatar_changed
        Analytics.track(
          user_id: current_user.segment_id,
          event: 'Changed profile picture'
          )
        render json: @portrait, status: :ok
      else
        render json: @portrait.errors.full_messages, status: :unprocessable_entity
      end
    else
      new_portrait = Portrait.new(portrait_params)
      if new_portrait.save
        NotificationMailer.new(new_portrait).avatar_changed
        render json: new_portrait, status: :created, location: [:v1, new_portrait]
      else
        render json: new_portrait.errors.full_messages, status: :unprocessable_entity
      end
    end
  end

  api :GET, 'v1/portraits/:user_id', 'Returns portrait record'
  def show
    portrait = Portrait.find_by_user_id(params[:user_id])
    render json: portrait
  end

  api :DELETE, 'v1/portraits/1', 'Permanently deletes portrait'
  def destroy
    Portrait.where(user_id: params[:id]).destroy_all
    Analytics.track(
      user_id: User.find(params[:id]),
      event: 'Deleted all portraits of user'
      )
    head :no_content
  end

  private

  def portrait_params
    params[:portrait].permit(:user_id, :image)
    end
end
