class V1::SectionTextsController < ApplicationController
  before_action :authenticate_user!
  # before_action :set_section_text, only: [:show, :update, :destroy]  # Already done by cancaon load and authorize
  load_and_authorize_resource
  # Added skip command for collaborator edit. TODO: need more elaborate authorization
  skip_authorize_resource

  respond_to :json

  api :GET, 'v1/section_texts', 'All section texts this user has created, unless a search criteria is provided'
  param :q, Hash, 'search query string, in format defined by Ransack gem. Current field allowed are title and content. See https://github.com/activerecord-hackery/ransack' do
    param :title_cont, String, 'This a search query example. Here, we search for titles that contain the provided string'
    param :title_or_content_cont, String, 'This a search query example. Here, we search for sections where the title or content contain the provided string'
  end
  def index
    # TODO: only return the sections of that user.
    # @section_texts = SectionText.all
    # respond_with(@section_texts)
    @q = SectionText.ransack(params[:q]) # Examples: title_cont: 'Hello', or title_or_content_cont 'text_to_search'
    # If we need to specified a search scope, use: SectionText.ransack(params[:q], scope: set_search_scope)
    @section_texts = @q.result(distinct: true)
    respond_with(@section_texts)
  end

  api :GET, 'v1/section_texts/1', 'Returns the specified section text'
  def show
    respond_with(@section_text)
  end

  # Not being used.
  # api :POST, 'v1/section_texts'
  # api :POST, 'v1/section_texts.json'
  # def create
  #   @section_text = SectionText.new(section_text_params)
  #   respond_with(@section_text)
  # end

  api :PATCH, 'v1/section_texts/1', 'Update the title or content'
  api :PUT, 'v1/section_texts/1', 'Update the title or content'
  # api :PATCH, 'v1/section_texts/1.json'
  # api :PUT, 'v1/section_texts/1.json'
  def update
    # Conflict between active model serializer and responders,
    # Serialization fails on errors, so doing by hand
    # @section_text.update(section_text_params)
    # respond_with(@section_text)
    if @section_text.update(section_text_params)
      render json: @section_text, status: :ok, location: [:v1, @section_text]
    else
      render json: @section_text.errors.full_messages, status: :unprocessable_entity
    end
  end

  # api :DELETE, 'v1/section_texts/1'
  # api :DELETE, 'v1/section_texts/1'
  # def destroy
  #   @section_text.destroy
  #   head :no_content
  # end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_section_text
    @section_text = SectionText.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def section_text_params
    params.require(:section_text).permit(:title, :content)
  end

  # Unused, pending rewrite of search functionality
  # def set_search_scope
  #   params[:all] ? :all : :title
  # end
  # However, restricting on access rights. Can only retrieve those you created
  def set_search_scope
  end
end
