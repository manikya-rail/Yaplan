class Action < Task
  # validates :title ,presence: true
  has_many :attachments, as: :attachmentable
  accepts_nested_attributes_for :attachments, allow_destroy: true
  amoeba do
    enable
    include_association [:attachments]
    exclude_association [:user_tasks, :project_workflow_steps]
    nullify :project_id
    nullify :assigned_to_id
    nullify :approver_id
    # set state: 0
  end
end