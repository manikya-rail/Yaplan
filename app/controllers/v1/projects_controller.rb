class V1::ProjectsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource
  skip_authorize_resource only: [:index, :create]

  api :GET, 'v1/projects', 'Returns all active project from this user.'

  def index
    @total_projects = 0
    @projects = 
      if params[:archived]
          current_user.projects.where(archived: true).recent.page(params[:page])
      else
          projects = available_projects.includes(:category, :project_workflow, :tasks, :created_by,:recent_tasks).recent
      end
    if params[:q].present?
      @projects = @projects.search(params[:q]).recent
    end
    
      if params[:page].present?
        @total_projects = @projects.count
        @projects = @projects.page(params[:page]).per(15)
      end

      if params[:request_from] == 'dashbord'
        render json: @projects, root: "projects", each_serializer: DasbordProjectSerializer
      else
        render json: @projects, each_serializer: ProjectIndexSerializer, meta: { total_records: @total_projects }
      end 
  end

  api :GET, 'v1/projects/1', 'Returns the content of this project'
  def show
    if params[:basic]
      render json: @project, root: "project", serializer: ProjectBasicSerializer
    else
      segment_identify
      Analytics.track(
        user_id: current_user.segment_id,
        event: 'Project viewed',
        properties: @project.reporting_properties
      )
      render json: @project, root: "project" , serializer: ProjectSerializer
    end
  end

  api :POST, 'v1/projects', 'Creates a new project with no documents'
  param :title, String, 'Title of the project', require: true
  param :category_id, Integer, 'Category of the project', require: true
  def create
    @project = Project.new(project_params.merge(created_by: current_user, template_status: Project::REGULAR_PROJECT))
    authorize! :create, @project
    if @project.save
      project_workflow = @project.project_workflow
      WorkflowNotificationMailer.new(project_workflow).workflow_assigned.deliver_now! if project_workflow.present?
      segment_identify
      Analytics.track(
        user_id: current_user.segment_id,
        event: 'Project created',
        properties: @project.reporting_properties
      )
      Analytics.track(
        user_id: current_user.segment_id,
        event: 'Project Workflow created',
        properties: @project.project_workflow.reporting_properties
      ) if @project.project_workflow.present?
      render json: @project, root: "project", serializer: ProjectBasicSerializer 
    else
      render json: @project.errors.full_messages, status: :unprocessable_entity
    end
  end

  def archived_count
    @archived_count = current_user.projects.where(archived: true).count
    render json: @archived_count
  end

  # def basic
  #   render json: @project, root: "project", each_serializer: ProjectBasicSerializer
  # end

  def list
    @projects = available_projects.recent
    render json: @projects, root: "projects", each_serializer: ProjectBasicSerializer
  end

  def start_project
    unless has_any_pending_assigned_users?
      if @project.has_workflow?
        @project.update(start_at: DateTime.current)
        @project.create_activity(:started,owner: current_user,recipient: @project)
        @project.assign_first_task
      end
      NotificationMailer.new(@project).project_started
      render json: @project, root: "project", serializer: ProjectBasicSerializer
    else 
      render json: { project: {error: "All Assigned users not yet collaborated to this project"} } , status: :unprocessable_entity
    end
  end

  api :PATCH, 'v1/projects/1', 'Updates the title of the project and return the updated object, without dependencies'
  api :PUT, 'Update the title of the project'
  def update
    if @project.update(project_params)
      Analytics.track(
        user_id: current_user.segment_id,
        event: 'Project updated',
        properties: @project.reporting_properties
      )
      render json: @project, root: "project", serializer: ProjectBasicSerializer  #, status: :ok, location: [:v1, @project]
    else
      render json: @project.errors.full_messages, status: :unprocessable_entity
    end
  end

  api :DELETE, 'v1/project/1', 'Archives this project, and all its included documents'
  def destroy
    authorize! :destroy, @project
    @project.archive!
    Analytics.track(
      user_id: current_user.segment_id,
      event: 'Project archived',
      properties: @project.reporting_properties
    )
    head :no_content
  end

  #Collaborations of a project and it's documents
  def collaborators
    collaborators = @project.all_collaborations
    render json: collaborators, root: "collaborations"
  end

  # List all members (accepted invitees)
  api :GET, 'v1/projects/:id/members', 'Get all members/collaborators'
  def members
    members = @project.accepted_invitees
    render json: members, fields: [:id, :user_name, :project_access, :user_email, :role], root: "collaborations"
  end

  # list all invitees
  api :GET, 'v1/projects/:id/invites', 'Get all invites'
  def invites
    invitees = @project.all_invitees
    render json: invitees, fields: [:id, :user_name, :user_email, :invited_by, :status, :is_accepted], root: "collaborations"
  end

  api :PATCH, 'v1/projects/:id/archived_projects', 'To Unarchived Project'
  def unarchive
    authorize! :destroy, @project
    @project.un_archive!
    Analytics.track(
      user_id: current_user.segment_id,
      event: 'Project  Unarchived',
      properties: @project.reporting_properties
    )
    render json: @project, root: "project", serializer: ProjectBasicSerializer
  end

  api :GET, 'v1/projects/:id/accept_invitation', 'Accept Invitation'
  def accept_invitation # To do permission
    authorize! :accept_invitation, @project
    if @project.present?
      if @project.accept_invitation(current_user)
        @project.activities.where(key: "project.invitation",recipient: current_user).try(:first).try(:destroy)
        @project.create_activity(:accept,owner: current_user,recipient: @project)
        segment_identify
        Analytics.track(
          user_id: current_user.segment_id,
          event: "Project collaboration Accepted",
          properties: {
            project_id: @project.id,
            project_title: @project.title
          }
        )
        Analytics.track(
          user_id: current_user.segment_id,
          event: "Project registration Confirmed",
          properties: {
            project_id: @project.id,
            project_title: @project.title
          }
        )
        render json: {"message": "Success!", "status": "ok"}
      else
        render json: {"error": @project.errors.full_messages.try(:first) },status: :unprocessable_entity
      end
    else
      render json: 'error project not availabile', status: :unprocessable_entity
    end
  end


  def assign_workflow
    authorize! :update, @project
    @project.remove_existing_workflow! if @project.has_workflow?
    @project.workflow_template_id = params[:workflow_template_id]
    @project.create_project_workflow
    @project.update(start_at: nil,end_at: nil)
    project_workflow = @project.project_workflow
    WorkflowNotificationMailer.new(project_workflow).workflow_assigned.deliver_later!
    head :no_content
  end

  api :GET, 'v1/projects/:id/reject_invitation', 'Reject Invitation'
  def reject_invitation
    authorize! :reject_invitation, @project
    if @project.present?
      if @project.reject_invitation(current_user)
        #create activity here
        @project.activities.where(key: "project.invitation",recipient: current_user).try(:first).try(:destroy)
        segment_identify
        Analytics.track(
          user_id: current_user.segment_id,
          event: "Project collaboration Rejected",
          properties: {
            project_id: @project.id,
            project_title: @project.title
          }
        )
        render json: {"message": "Rejected!", "status": "ok"}
      else
        render json: { "error": @project.errors.full_messages.try(:first) }, status: :unprocessable_entity
      end
    else
      render json: 'error project not availabile', status: :unprocessable_entity
    end
  end

  def update_category
    category_id = params[:category_id]
    if @project.change_category!(category_id)
      render json: @project, include: json_children, status: :ok
    else
      render json: @project.errors.full_messages, status: :unprocessable_entity
    end
  end

  private

  # Never trust parameters from the scary internet, only allow the white list through.
  def project_params
    params[:project].permit(
      :title, :category_id, :description, :workflow_template_id
    )
  end

  def has_any_pending_assigned_users?
    @project.all_pending_invitees_of_tasks.present?
  end

  def segment_identify
    Analytics.identify(
      user_id: current_user.segment_id,
      traits: current_user.segment_traits
    )
  end

  def collaborator_params
    params[:collaborator].permit(:collaborator_emails, :invitation_message)
  end

  def available_projects
    current_user.all_collaborated_projects
  end

  # Include in the serializer does not seem to work. Including through the controller
  def json_children
    '*'
  end
end
