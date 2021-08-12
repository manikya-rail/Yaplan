class V1::SectionContainersController < ApplicationController
  before_action :authenticate_user!
  # before_action :set_section_container, only: [:show, :update, :destroy] # Already done by cancaon load and authorize
  # TODO: fix authorization. Anybody is allowed to add a section to a document!!!!
  load_and_authorize_resource except: [:create] # Bug, don't know how to fix
  # Added skip command for collaborator edit. TODO: need more elaborate authorization
  skip_authorize_resource

  respond_to :json

  # ROUTES: ::::: only: [:index, :create, :show, :update, :destroy] do

  api :GET, 'v1/section_containers', 'return all sections of that document'
  def index
    # TODO: user authentication
    # TODO: check the user has access
    @section_containers = SectionContainer.where(document: params[:document_id]).order(position: :asc)
    respond_with(@section_containers)
  end

  api :GET, 'v1/section_containers/1', 'returns the specified section container'
  def show
    render json: @section_container
  end

  api :POST, 'v1/section_containers', 'Create new section container for this document. A section text object is'\
                                       'automatically associated, with three possibilities:'\
                                      ' * when none is provided, a default one is created'\
                                      ' * when a section_text id is provided, it is used'\
                                      ' * when text to use to create a new section_text (title is mandatory, content is optional)'
  param :section_container, Hash, desc: 'Object container' do
    param :section_text, Hash, desc: 'Section Text to use', allow_nil: true, required: false do
      param :id, Numeric, desc: 'Id of a section_text to reuse', required: false
      param :title, String, desc: 'Section title, if content of a section_text is provided, then title is mandatory',
                            required: false, allow_nil: true
      param :content, String, desc: 'Section content, this is html formatted text', required: false, allow_nil: true
    end
    param :position, Integer, desc: 'position of the new container. Sections are ordered from 1 to k, 1 means top of '\
                                    ' the document. If unspecified, container is added at the end of the document', required: false
  end

  def create
    section_text =
      if section_container_params[:section_text]
        if section_container_params[:section_text][:id]
          SectionText.find(section_container_params[:section_text][:id])
        else
          SectionText.create(section_container_params[:section_text].merge(other_section_text_params))
        end
      else
        SectionText.create({ title: '' }.merge(other_section_text_params))
      end
    @section_container = SectionContainer.new(
      #  No nested resources, we don't need to get document_id from the request
      # caller has to provide the id in the json
      section_container_params.merge(section_text:  section_text))

    # Conflict between active model serializer and responders,
    # Serialization fails on errors, so doing by hand
    # @section_text.update(section_text_params)
    # respond_with(@section_container.save)
    if @section_container.save
      Analytics.track(
        user_id: current_user.segment_id,
        event: 'Document section added'
      )
      render json: @section_container, status: :created, location: [:v1, @section_container]
    else
      render json: @section_container.errors.full_messages, status: :unprocessable_entity
    end
  end

  api :PATCH, 'v1/section_containers/1'
  api :PUT, 'v1/section_containers/1', 'Updating the position of the section container. Either one of position '\
                                        'or after is required.'
  param :section_container, Hash, desc: 'Object container', required: true do
    param :position, Integer, desc: 'position of the new container. Sections are ordered from 1 to k, 1 means top of '\
                                      ' the document. If unspecified, container is added at the end of the document', required: false
    param :after, Integer, desc: 'ID of the container that our container will now be immediately after. '\
                                  'Use ID = 0 for first position in the document', required: false
  end
  def update
    if @section_container.update(section_container_update_params)
      head :no_content
      # render json: @section_container, status: :ok, location: [:v1, @section_container]
    else
      render json: @section_container.errors.full_messages, status: :unprocessable_entity
    end
  end

  api :DELETE, 'v1/section_containers/1', 'Remove this section from the document. The underlying text however is kept for later potential usages'
  def destroy
    Analytics.track(
      user_id: current_user.segment_id,
      event: 'Document Section removed'
    )
    @section_container.destroy
    head :no_content
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_section_container
    @section_container = SectionContainer.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def section_container_params
    params[:section_container].nil? ? {} : params[:section_container].
      # Change from Demid:
      # permit(:position, :after, :document_id, :section_text)
      permit(:position, :after, :document_id, section_text: [:id, :title, :content])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def section_container_update_params
    params.require(:section_container).permit(:position, :after)
  end

  def other_section_text_params
    { created_by: current_user, project: Document.find(params[:section_container][:document_id]).project }
  end
end
