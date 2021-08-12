class Comment < ActiveRecord::Base
  validates :comment_text, presence: true
  validates :commenter_id, presence: true
  belongs_to :commentable, polymorphic: true, optional: true
  belongs_to :commenter, class_name: 'User', foreign_key: 'commenter_id', optional: true

  default_scope { order(updated_at: :DESC) }

  def can_access?(user)
    if commentable.is_a?(Project)
      commentable.collaborators.ids.include? user.id
    else
      (commentable.collaborators.ids.include? user.id) || (commentable.project.collaborators.ids.include? user.id)
    end
  end
end
