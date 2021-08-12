class CommunicationService


	def initialize(communication)
		@communication = communication
	end


	def trigger_to_recepients
		trigger_communication_mails
		create_internal_notifications
	end

	private

	def trigger_communication_mails
		project = @communication.project_workflow_step.project_workflow.project
		message = @communication.message
		subject = @communication.subject
		copied_attachments = @communication.attachments.collect do |attachment|
			begin
				{file_name: "#{attachment.file_attachment.file.filename}", data: Net::HTTP.get(URI.parse(attachment.file_attachment.url))}
			rescue Exception => error
			end
		end
		# Avoid s3 attachment loading at each time 
		@communication.recepient_emails.each do |recipient_email|
			mail = Apostle::Mail.new("workflow-communication", email: recipient_email)
			mail.message = message
			mail.subject = subject
			mail.recipient_name = ( User.find_by_email(recipient_email).try(:full_name) || recipient_email )
      		mail.project_name = project.title
      		mail.login_link = "#{ENV['DOMAIN']}/#/reg/login"
			copied_attachments.each do |attachment|
				mail.attachments[attachment[:file_name]] = attachment[:data]
			end
			mail.deliver!
		end
	end


	def  create_internal_notifications
		project = @communication.project_workflow_step.project_workflow.project
		@communication.recepient_emails.each do |recipient_email|
			user = User.find_by_email(recipient_email)
		 	project.create_activity(:communication_triggered,recipient: user) if user.present?		
		end
	end
	

	
end


