class CommunicationSerializer < ActiveModel::Serializer
  attributes :id, :message, :project_workflow_step_id, :recepient_emails, :attachments, :subject, :communication_mode
  has_many :attachments

  # def attachments
  #   binding.pry
  #   object.attachments
  # end
end
