class CollaborationInvitationMailer < Devise::Mailer
	# include Apostle::Mailer
	default template_path: 'devise/mailer'
	
	#forgot password
	def reset_password_instructions(record, token, opts = {})
		@user_name = record.full_name
		@reset_password_link = "#{ENV['DOMAIN']}/#/reg/password?reset_password_token=#{token}"
		p "------------------------------------------------------"
		p "Reset password mail to #{record.email}"
		p "-------------------------------------------------------"
		# mail("forgot_password_mail",email: record.email)
		mail(to: "to@gmail.com", from: "from@gmail.com", subject: "Sample")
	end

	# Invitation for new user to collaborate on project/document
  def invitation_instructions(record, token, options={})
		@message = record.invitation_message
		@collaborator_name = record.full_name
		invitation_type = record.invitation_type
		collaboration_object_type = invitation_type.class.to_s.downcase
		@sender_name = record.invited_by.try(:full_name)
		@collaboration_link = "#{ENV['DOMAIN']}/users/invitation/accept?invitation_token=#{token}&invitation_type=#{collaboration_object_type}&invitation_type_id=#{invitation_type.id}"
		p "------------------------------------------------------"
		p "New User - Sending CollabInvitation for #{collaboration_object_type} to #{record.email}"
		p "-------------------------------------------------------"
		if collaboration_object_type == "project"
			@project_title = record.invitation_type.title
			mail("new_user_project_collaboration_invitation",email: record.email)
		elsif collaboration_object_type == "document"
			@document_title = record.invitation_type.title
			@project_title = record.invitation_type.project.title
			mail("new_user_document_collaboration_invitation",email: record.email)
		end
	end

	# Collaboration for an existing grapple user
	def collaboration_notification(attributes={})
    invited_by = attributes[:invited_by]
		@sender_name = invited_by.try(:full_name)
		@invitee_name = attributes[:invitee].full_name
		collaboration_object_type = attributes[:invitation_type].class.to_s.downcase
		@collaboration_link = "#{ENV['DOMAIN']}/#/app/#{collaboration_object_type.pluralize}/#{attributes[:invitation_type].id}/accept_invitation"
		@reject_link = "#{ENV['DOMAIN']}/#/app/#{attributes[:invitation_type].class.name.downcase.pluralize}/#{attributes[:invitation_type].id}/reject_invitation"
		@message = attributes[:invitation_message].to_s
		@subject = "Your help has been requested for a new #{collaboration_object_type} in Grapple."
		p "-----------------------------------------------------------------------------"
		p "Existing User - Sending CollabInvitation to #{@invitee_name} - #{attributes[:email]}"
		p "-----------------------------------------------------------------------------"
		if collaboration_object_type == "project"
			@project_title = attributes[:invitation_type].title
			mail("existing_user_project_collaboration_invitation",email: attributes[:email])
		elsif collaboration_object_type == "document"
			@document_title = attributes[:invitation_type].title
			@project_title = attributes[:invitation_type].project.title
			mail("existing_user_document_collaboration_invitation",email: attributes[:email])
		end
	end

	#New user confirmation mail
	def confirmation_instructions(record, token, opts={})
		@user_name = record.full_name
  		@confirmation_link =  "#{ENV['DOMAIN']}/users/confirmation?confirmation_token=#{token}"
		p "-----------------------------------------------------------------------------"
		p "Confirmation mail for new user - #{record.email}"
		p "-----------------------------------------------------------------------------"
  		# mail("user-mail-confirmation",email: record.email)
  		mail(to: "to@gmail.com", from: "from@gmail.com", subject: "Sample Registration")
	end

	#Welcome To Project
	def welcome_to_project(project:, user:)
		@user_name = user.full_name
		@project_title = project.title
		@project_link = "#{ENV['DOMAIN']}/#/app/projects/#{project.id}/collaborators"
		p "-----------------------------------------------------------------------------"
		p "Welcome to Project - #{user.email}"
		p "-----------------------------------------------------------------------------"		
		mail("welcome-to-project", email: user.email)
	end
end
