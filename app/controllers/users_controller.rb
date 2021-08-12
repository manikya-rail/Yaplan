class UsersController < ApplicationController

  before_action :authenticate_user!, :set_current_user
  before_action :authenticate_as_admin!, except: [:show, :update, :invite,:available_projects]
  require 'json'
  require 'json/pure'
  def show
    render json: @user, include: [:portrait]
  end

  #Update full_name of current user
  def update
    if @user.update(user_params)
      NotificationMailer.new(@user).personal_details_changed
      render json: @user, status: :ok
    else
      render json: @user.errors.full_messages, status: :unprocessable_entity
    end
  end

  api :POST, 'users/invite', 'Invite users to Grapple by email'
  param :emails, String, 'A string of emails seperated by commas', required: true
  def invite
    emails = params[:emails].gsub(/\s+/, '').split(',')
    emails.each do |email|
      begin
        InviteUserMailer.invitation_mail(current_user,email).deliver_now
      rescue Exception => e
        puts "Problems sending mail!"
      end
    end
    render json: {"emails": emails}.to_json, status: :ok
  end

  def destroy
    if @user.archive!
      render json: @user, status: :success
    else
      render json: @user.errors.full_messages, status: :unprocessable_entity
    end
  end

  def unarchive
    if @user.un_archive!
      render json: @user, status: :success
    else
      render json: @user.errors.full_messages, status: :unprocessable_entity
    end
  end

  def available_projects
    projects = current_user.availabile_projects.search(params[:q])
    render json: projects, each_serializer: OptProjectSerializer
  end

  private

  def user_params
    params.require(:user).permit(:last_name,:first_name,:country_code,:phone_number,:time_zone)
  end

  def set_current_user
    @user = User.find_by_id(params[:id])
  end

end
