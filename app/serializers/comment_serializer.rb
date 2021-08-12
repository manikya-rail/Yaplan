class CommentSerializer < ActiveModel::Serializer
  attributes :id, :comment_text, :parent_comment_id, :commentable_id,:created_at, :commenter

  def commenter
  	commenter = object.commenter
  	{ "id":  commenter.id, "full_name": commenter.full_name, "portrait": commenter.portrait }
  end
end
