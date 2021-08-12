class Communication < ActiveRecord::Base

	enum communication_mode: [:approved, :rejected]

	validates :communication_mode, presence: true

	belongs_to :project_workflow_step, optional: true
	belongs_to :workflow_template_step, optional: true

	has_many :attachments, as: :attachmentable
	accepts_nested_attributes_for :attachments, allow_destroy: true
	amoeba do
 		enable
  		include_association :attachments
  		nullify :project_workflow_step_id
  		nullify :workflow_template_step_id
	end
	def all_attachment_files
		attachments.pluck(:file_attachment)
	end

	def trigger_communication
		CommunicationService.new(self).delay.trigger_to_recepients if recepient_emails.present?
	end
end