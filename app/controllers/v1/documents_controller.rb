class V1::DocumentsController < ApplicationController
  # before_action :set_document, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  load_and_authorize_resource
  skip_authorize_resource :only => [:index, :create, :submit,:versions]

  api :GET, 'v1/documents', 'Returns all documents from this user. TODO, currently, this is all documents. Document dependencies are included.'
  param :project_id, :number, desc: 'Only returns documents of this project'

  def index
    @documents_count = 0
    @documents = if params[:project_id]
                  get_project_documents(project_id: params[:project_id]).recent
                else
                  DocumentService.new.all_accessible_documents(user: current_user).recent
                end
    @documents = ( params[:archived].present? ? @documents.archived : @documents.active ).includes([:created_by,:assigned_to,:approver,:project=>:category],:section_containers)
    if params[:q].present?
      @documents = @documents.search(params[:q])
    end
    if params[:page].present?
      @documents_count = @documents.count
      @documents = @documents.page(params[:page]).per(15)
    end
    render json: {documents: @documents,root: "documents", each_serializer: DocumentIndexSerializer, meta: { total_records: @documents_count }}
  end

  def show
    if (params[:view] || params[:editor])
      Analytics.track(
        user_id: current_user.segment_id,
        event: 'Document viewed',
        properties: @document.reporting_properties
      ) if params[:view]
      render json: {document: @document, root: "document", serializer: DocumentShowSerializer, include: json_children}
    elsif params[:set_cover]
      render json: {document: @document, root: "document", serializer: DocumentCoverSerializer}
    else
      render json: {document: @document, include: json_children}
    end
  end

  def create
    project = 
      if document_params[:project_id].present?
        Project.find_by_id(document_params[:project_id])
      elsif params[:document][:category_id].present?
        project_title = generate_project_title(document_params[:title])
        Project.create({
          created_by: current_user, 
          title: project_title, 
          category_id: params[:document][:category_id],
          template_status: Project::REGULAR_PROJECT
        })
      end
    authorize! :can_create_documents, project
    document = Document.find_by_id(params[:duplicate_from_id])
    reporting= {}
    new_document =
      if document.nil?
        Document.new(document_params.merge({created_by: current_user, project: project,assigned_to: current_user}))
      else
        authorize! :read, document
        reporting[:from_template] = true
        reporting[:from_template_id] = params[:duplicate_from_id]
        reporting[:from_template_totme] = document.title
        DocumentService.new.duplicate_document(user: current_user, document: document, project: project)
      end
    if new_document.save
      new_document.create_activity(:create,owner: current_user,recipient: document)
      NotificationMailer.new(new_document).document_created
      Analytics.track(
          user_id: current_user.segment_id,
          event: 'Document created',
          properties: new_document.reporting_properties.merge(reporting)
      )
      render json: {document: new_document, include: json_children, status: :created, location: [:v1, new_document]}
      
    else
      render json: {document: new_document.errors.full_messages, status: :unprocessable_entity}
    end
  end

  def set_assignee
    authorize! :manage, @document
    @user = User.find(params[:user_id])
    if @document.update(assigned_to: @user,state: :assigned)
      render json: @document, status: :ok, location: [:v1, @document]
    else
      render json: @document.errors.full_messages, status: :unprocessable_entity
    end
  end

  api :PATCH, 'v1/documents/1', 'Updates the title of the document and return the updated object, without dependencies'
  api :PUT, 'Update the title of the document'
  def update
    authorize! :edit, @document
    if @document.update(document_params)
      Analytics.track(
          user_id: current_user.segment_id,
          event: 'Document updated',
          properties: @document.reporting_properties
      )
      render json: {document: @document, status: :ok, location: [:v1, @document]}
    else
      render json: {document: @document.errors.full_messages, status: :unprocessable_entity}
    end
  end

  api :DELETE, 'v1/documents/:id', 'Archives this document.'
  def destroy
    authorize! :destroy, @document
    @document.archive!
    Analytics.track(
        user_id: current_user.segment_id,
        event: 'Document archived',
        properties: @document.reporting_properties
    )
    head :no_content
  end

  api :DELETE, 'v1/documents/:id/destroy_for_good', 'Destroys this document. It is not kept or marked as inactive'
  def destroy_for_good
    authorize! :destroy, @document
    @document.destroy
    head :no_content
  end

  def archived_count
    if params[:project_id].present?
      @archived_count = get_project_documents(project_id: params[:project_id]).archived.count
    else
      @archived_count = DocumentService.new.all_accessible_documents(user: current_user).archived.count
    end
    render json: @archived_count
  end

  def add_tags #add tags to document
    set_document
    authorize! :add_tags, @document
    @document.tag_list.add(params[:document][:tags],parse: true)
    @document.save
    render json: @document.tags, root: "tags", each_serializer: TagSerializer
  end

  def remove_tags #remove tags from document
    set_document
    authorize! :remove_tags, @document
    @document.tag_list.remove(params[:document][:tags],parse: true)
    @document.save
    render json: @document.tags, root: "tags", each_serializer: TagSerializer
  end

  def tagged  #list out all documents with given tag ( ?tag=finance)
    if params[:tag].present?
      @documents = Document.tagged_with(params[:tag])
      @documents.to_a.select!{|document| can?(:read, document) }
      render json: @documents, root: "documents"
    end
  end

  def versions
    authorize! :read, @document
    versions = @document.versions
    render json: {versions: versions,each_serializer: VersionSerializer, root: 'versions'}
  end

  def show_version
     document_version = @document.versions.find_by_version_number(params[:version_number])
     render json: document_version, status: :ok, serializer: VersionShowSerializer,root: 'document'
  end

  def revert_version
    document_version = @document.versions.find_by_version_number(params[:version_number])
    @document.revert_to(old_version: document_version)
    @document.reload
    render json: @document
  end

  def track_changes
    document_diff = TrackChangeService.new(@document, params[:version_number]).diff_versions
    render json: document_diff, status: :ok, root: 'document'
  end

  api :POST, 'v1/documents/:id/submit', 'Submits the approval request for the document'
  def submit
    authorize! :submit_document, @document
    approver = @document.approver
    message = params[:message]
    user_task = @document.user_tasks.assign.where(user: current_user,response_status: 3).last
    user_task.set_as_accepted!
    @document.create_activity :submited,owner: current_user,recipient: @document
    Analytics.identify(
        user_id: current_user.segment_id,
        traits: current_user.segment_traits
    )
    track(user: current_user, event: 'Document Submitted for Approval', approver: approver, approver_email: approver.email, approver_message: message)
    track(user: approver, event: 'Got Approval Request', approver: approver, approver_email: approver.email, approver_message: message)
    render json: @document, status: :ok
  end

  api :GET, 'v1/documents/:id/preview', 'Previews the document in PDF form'
  def preview
    pdf = DocumentPdfService.new(@document.id).pdf
    proj = Project.find(@document.project_id)
    render json: {:doc_title=>@document.title, :proj_name=>proj.title}
  end

  api :PUT, 'v1/documents/:id/unarchive', 'Archive document'
  def unarchive
    @document.un_archive!
    authorize! :unarchive, @document
    Analytics.track(
      user_id: current_user.segment_id,
      event: 'Document Unarchived',
      properties: @document.reporting_properties
    )
    render json: {message: @document}
  end

  api :GET, 'v1/documents/:id/accept_invitation', 'Accept collaborators'
  def accept_invitation
    if @document.present?
      authorize! :accept_invitation, @document
      if @document.accept_invitation(current_user)
        @document.activities.where(key: "document.invitation",recipient: current_user).try(:first).try(:destroy)
        @document.create_activity(:accept,owner: current_user,recipient: @document)
        segment_identify
        Analytics.track(user_id: current_user.segment_id, 
          event: "Document collaboration Accepted",
          properties: {
            document_id: @document.id,
            document_title: @document.title,
            project_id: @document.project.id
          }
        )
        render json: {"message": "Success!", "status": "ok"}
      else
        render json: {"error": "You already perform this action"}, status: :unprocessable_entity
      end
    else
      render json: "error document not availabile" ,status: :unprocessable_entity
    end
  end

  api :GET, 'v1/documents/:id/reject_invitation', 'Reject collaborators'
  def reject_invitation
    if @document.present?
      authorize! :reject_invitation, @document
      if @document.reject_invitation(current_user)
        @document.activities.where(key: "document.invitation",recipient: current_user).try(:first).try(:destroy)
        @document.create_activity(:rejected_invitation,owner: current_user,recipient: @document)
        segment_identify
        Analytics.track(user_id: current_user.segment_id, 
          event: "Document collaboration Rejected",
          properties: {
            document_id: @document.id,
            document_title: @document.title,
            project_id: @document.project.id
          }
        )
         render json: {"message": "Success!", "status": "ok"}
      else
        render json: {"error": "You already perform this action"}, status: :unprocessable_entity
      end
    else
      render json: "error document not availabile" ,status: :unprocessable_entity
    end
  end

  #change approver for each document
  api :PUT, 'v1/documents/:id/set_approver', 'Set approver'
  param :user_id, :number
  def set_approver
    if @document.update(approver_id: params[:user_id])
      render json: @document, include: json_children
    else
      render json: @document.errors.full_messages, status: :unprocessable_entity
    end
  end

  api :PUT, 'v1/documents/:id/approve', 'Set approver'
  def approve
    authorize! :approve, @document
    user_task = @document.user_tasks.approve.where(user: current_user,response_status: 3).last
    user_task.set_as_accepted!
    @document.create_activity :approved,owner: current_user,recipient: @document
    render json: @document, include: json_children,status: :ok
  end
  def reject
    authorize! :reject, @document
    user_task = @document.user_tasks.reject.where(user: current_user,response_status: 3).last
    user_task.set_as_rejected!
    @document.create_activity :rejected,owner: current_user,recipient: @document.assigned_to,params: {message: params[:message]}
    render json: @document, include: json_children,status: :ok
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_document
      @document = Document.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def document_params
      params.require(:document).permit(
        :title,:project_id,:approver_id,:state,:description,:proposed_startdate,
        :proposed_enddate,:tag_list,:header,:footer,:cover_page, :show_cover, :subtitle,
        :logo, :show_contents, :is_public, :published,:show_page_number
      )
    end

    def get_project_documents(project_id:)
      Document.where(project_id: project_id)
    end

    def generate_project_title(document_title)
      "Project for " + document_title
    end

    # Include in the serializer does not seem to work. Including through the controller
    def json_children
      '*.*'
    end

    def segment_identify
      Analytics.identify(
        user_id: current_user.segment_id,
        traits: current_user.segment_traits
      )
    end

    # Track approval request event & trigger sendwithus email
    def track(user:, event:, approver:, approver_email:, approver_message: '')
      Analytics.track(
        user_id: user.segment_id,
        event: event,
        properties: @document.reporting_properties.merge({
            approver_email: approver_email,
            approver_message: approver_message,
            approver: approver.segment_traits
        })
      )
    end
end
