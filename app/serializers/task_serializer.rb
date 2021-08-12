class TaskSerializer < ActiveModel::Serializer
  attributes :id, :type, :title, :is_public, :is_template,:state, :archived, :project_id, :created_at, :updated_at, :description, :assigned_to_id, :approver_id, :attachments
  belongs_to :created_by
  belongs_to :approver
  belongs_to :assigned_to
  belongs_to :approver
  belongs_to :project
  has_many :attachments

  def is_template
  	object.is_template? if object.is_a?(Document)
  end
end
