class V1::TagsController < ApplicationController

	def index
		if params[:document_id].present?
			document = Document.find(params[:document_id])
			@tags = document.tags
		else
			@tags = ActsAsTaggableOn::Tag.all
		end
		render json: @tags, root: "tags", each_serializer: TagSerializer
	end
end
