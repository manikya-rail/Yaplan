class BatchController < ApplicationController
  before_action :authenticate_user!

  def collaborated_documents
    collaborated_documents = Document.where(created_by: current_user, archived: false).select { |document| document.collaborators.size > 0 }
    render json: collaborated_documents, include: json_children, root: :collaborated_documents
  end

  private

  def json_children
    :collaborators
    end
end
