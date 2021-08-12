class NotificationMailer
	APOSTLE_MAIL_TEMPLATE_SLUG = { 
		project_created: "notification-project-created",
		document_created: "notification-document-created",
		project_toggle_archive: "notification-project-toggle-archive",
		document_toggle_archive: "notification-document-toggle-archive",
		avatar_changed: "avatar-changed",
		personal_details_changed: "personal-details-changed",
		project_started: "notification-project-started",
		project_completed: "notification-project-completed",
		remove_collaborator: "remove-collaborator",
    user_invited_to_project: "user-invited-to-project-notification",
    user_invited_to_document: "user-invited-to-document-notification",
    welcome_to_document: "welcome-to-document",
    welcome_to_project: "welcome-to-project",
    project_invitation_rejected: "project-invitation-rejected"
	}
	def initialize(notification_object)
		@notification_object = notification_object
		@data = {"login_link": "#{ENV['DOMAIN']}/#/reg/login"}
		@template_name = ''
    @receivers = []
	end
	
	def project_created
		@data[:project_owner] = @notification_object.created_by.full_name
		@data[:project_name] = @notification_object.title
		@template_name = APOSTLE_MAIL_TEMPLATE_SLUG[:project_created]
    @receivers << @notification_object.created_by
    trigger_user_specific_emails
	end

	def document_created
		@data[:document_owner] = @notification_object.created_by.full_name
		@data[:document_name] = @notification_object.title
    @data[:project_name] = @notification_object.project.try(:title)
    @data[:project_owner] = @notification_object.project.created_by.try(:full_name)
		@template_name = APOSTLE_MAIL_TEMPLATE_SLUG[:document_created]
		@receivers << @notification_object.created_by
    @receivers << @notification_object.project.created_by
    trigger_user_specific_emails
	end

	def project_toggle_archive
		status = @notification_object.archived ? "archived" : "unarchived"
		@data[:project_owner] = @notification_object.created_by.full_name
		@data[:project_name] = @notification_object.title
		@data[:project_status] = status
		@template_name = APOSTLE_MAIL_TEMPLATE_SLUG[:project_toggle_archive]
    @receivers << @notification_object.created_by
    trigger_user_specific_emails
	end

	def document_toggle_archive
		status = @notification_object.archived ? "archived" : "unarchived"
		@data[:document_name] = @notification_object.title
		@data[:document_status] = status
		@template_name = APOSTLE_MAIL_TEMPLATE_SLUG[:document_toggle_archive]
    @receivers << @notification_object.created_by
    @receivers << @notification_object.project.created_by
    @data[:recipient_names] = recipient_names
    trigger_user_specific_emails
	end

	def avatar_changed
		@data[:user_name] = @notification_object.user.full_name
		@template_name = APOSTLE_MAIL_TEMPLATE_SLUG[:avatar_changed]
		@receivers << @notification_object.user
		trigger_user_specific_emails
	end

	def personal_details_changed
		@data[:user_name] = @notification_object.full_name
		@data[:full_name] = @notification_object.full_name
		@data[:email] = @notification_object.email
		@template_name = APOSTLE_MAIL_TEMPLATE_SLUG[:personal_details_changed]
		@receivers << @notification_object
		trigger_user_specific_emails
	end

	def project_started
		@data[:project_owner] = @notification_object.created_by.try(:full_name)
		@data[:project_name] = @notification_object.title
		@template_name = APOSTLE_MAIL_TEMPLATE_SLUG[:project_started]
		@receivers << @notification_object.created_by
		trigger_user_specific_emails
	end

	def project_completed
		@data[:project_owner] = @notification_object.created_by.full_name
		@data[:project_name] = @notification_object.title
		@template_name = APOSTLE_MAIL_TEMPLATE_SLUG[:project_completed]
		@receivers << @notification_object.created_by
		trigger_user_specific_emails
	end

	def remove_collaborator
		@data[:collaborator_name] = @notification_object.collaborator.try(:full_name)
		@data[:collaboration_object_title] = @notification_object.collaboration_level.try(:title)
    if @notification_object.collaboration_level.is_a?(Project)
      @data[:collaboration_object_type] = "project" 
      @data[:project_owner] =  @notification_object.collaboration_level.created_by.try(:full_name)
      @data[:owner_email] = @notification_object.collaboration_level.created_by.try(:email)
    else
      @data[:collaboration_object_type] = "document"
      @data[:project_owner] =  @notification_object.collaboration_level.created_by.try(:full_name)
      @data[:owner_email] = @notification_object.collaboration_level.project.created_by.try(:email)
		end
    @template_name = APOSTLE_MAIL_TEMPLATE_SLUG[:remove_collaborator]
    @receivers << @notification_object.collaborator
		trigger_user_specific_emails
	end

  # Notification - User invited to project/document - ( project owner, document owner)
  def user_invited
    invited_by = @notification_object[:invited_by]
    collaborator = @notification_object[:collaborator]
    collaboration_object = @notification_object[:collaboration_object]
    invitation_message = @notification_object[:message]
    @data[:sender_name] = invited_by.try(:full_name)
    @data[:collaborator_name] = collaborator.try(:full_name)
    @data[:message] = invitation_message.to_s
    collaboration_object_type = collaboration_object.class.to_s
    if collaboration_object_type == "Project"
      @data[:project_title] = collaboration_object.try(:title)
      @template_name = APOSTLE_MAIL_TEMPLATE_SLUG[:user_invited_to_project]
    elsif collaboration_object_type == "Document"
      @data[:project_title] = collaboration_object.project.try(:title)
      @data[:document_title] = collaboration_object.try(:title)
      @template_name = APOSTLE_MAIL_TEMPLATE_SLUG[:user_invited_to_document]
      @receivers << collaboration_object.project.created_by
      @receivers << collaboration_object.assigned_to
    end
    @receivers << collaboration_object.created_by
    @data[:recipient_names] = recipient_names
    trigger_user_specific_emails
  end

  # Project Invitation Rejected - Project Owner
  def project_invitation_rejected
    project = @notification_object.collaboration_level
    @data[:project_title] = project.try(:title)
    @data[:project_owner] = project.created_by.try(:full_name)
    @data[:invitee_name] = @notification_object.collaborator.try(:full_name)
    @data[:project_link] = "#{ENV['DOMAIN']}/#/app/projects/#{project.id}/collaborators"
    @template_name = APOSTLE_MAIL_TEMPLATE_SLUG[:project_invitation_rejected]
    @receivers << project.created_by
    trigger_user_specific_emails
  end

  # Welcome to Document - Collaborator - Cc: Document owner, Project owner
  def welcome_to_document  # notification_object = {document: , user: }
    document = @notification_object[:document]
    user = @notification_object[:user]
    @data[:user_name] = user.try(:full_name)
    @data[:document_title] = document.title
    @data[:project_title] = document.project.try(:title)
    @data[:document_link] = "#{ENV['DOMAIN']}/#/app/documents/view/#{document.id}"
    @project_owner = document.project.try(:created_by)
    @data[:project_owner] = @project_owner.try(:full_name)
    p "-----------------------------------------------------------------------------"
    p "Welcome to Document - #{user.email}"
    p "-----------------------------------------------------------------------------"
    @template_name = APOSTLE_MAIL_TEMPLATE_SLUG[:welcome_to_document]
    @receivers << user
    @receivers << @project_owner
    @receivers << document.assigned_to    
    @data[:recipient_names] = recipient_names
    trigger_user_specific_emails
  end

  #Welcome To Project - Collaborator - Cc: Project Owner
  def welcome_to_project  # notification_object = {project:, user:}
    project = @notification_object[:project]
    user = @notification_object[:user]
    @data[:user_name] = user.try(:full_name)
    @data[:project_title] = project.try(:title)
    @data[:project_link] = "#{ENV['DOMAIN']}/#/app/projects/#{project.id}/documents"
    @project_owner = project.try(:created_by)
    @data[:project_owner] = @project_owner.try(:full_name)
    p "-----------------------------------------------------------------------------"
    p "Welcome to Project - #{user.email}"
    p "-----------------------------------------------------------------------------"
    @template_name = APOSTLE_MAIL_TEMPLATE_SLUG[:welcome_to_project]
    @receivers << user
    @receivers << @project_owner
    @data[:recipient_names] = recipient_names
    trigger_user_specific_emails
  end

private

  def recipient_names
    recipients = @receivers.map { |r| r.try(:full_name)  }
    recipients.uniq!
    recipients.compact!
    if recipients.size > 2
      "#{recipients[0]}, #{recipients[1]} and #{recipients[2]}"
    else
      recipients.join(" and ")
    end
  end

  def trigger_user_specific_emails
    @receivers.compact.uniq.each do |receiver|
      mail = Apostle::Mail.new(@template_name, email: receiver.email )
      mail.data = @data
      mail.deliver!
    end
  end
	
end