class V1::CommentsController < ApplicationController
  before_action :authenticate_user!
  before_action :find_commentables_object, only: [:index, :create]

  def index
    comments = @commentable.comments.sort_by(&:created_at).reverse!
    render json: comments, root: 'comments'
  end

  def create
    comment = @commentable.comments.new(comment_params)
    if comment.save
      @activity_object = @commentable.is_a?(SectionContainer) ? @commentable.document : @commentable
      @activity_object.create_activity(:commented, owner: current_user, recipient: @activity_object)
      render json: comment, status: :created
    else
      render json: comment, status: :unprocessable_entity
    end
  end

  def destroy
    comment = Comment.find(params[:id])
    authorize! :destroy, comment
    comment.destroy
    head :no_content
  end

private

  def comment_params
    params.require(:comment).permit(:comment_text).merge(commenter: current_user)
  end

  def find_commentables_object
    @commentable = if params[:document_id].present?
                        Document.find(params[:document_id])
                     elsif params[:section_container_id].present?
                        SectionContainer.find_by_id(params[:section_container_id])
                     end
  end
end
