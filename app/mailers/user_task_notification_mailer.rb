class UserTaskNotificationMailer
# TASK mails - User specific mails 
  APOSTLE_MAIL_TEMPLATE_SLUG = {
    complete_new_task: "complete-new-task",
    complete_reassigned_task: "complete-reassigned-task",
  	review_decision: "review-decision-owner",
  	review_task: "review-task"
  }

  	def initialize(user_task)
  		@user_task = user_task
  		@data = {"login_link": "#{ENV['DOMAIN']}/#/reg/login"}
  		@template_slug = ''
  		@receiver_emails = []
      @task = user_task.task
      set_mail_receivers
  	end

  # Complete Action/Document - Task Owner
	def complete_task  
		project = @task.project
    @data[:task_type] = @task.class.to_s.downcase
		@data[:task_name] = @task.title
		@data[:project_name] = project.title
		@data[:task_owner] = @task.assigned_to.try(:full_name)
		@data[:task_approver] = @task.approver.try(:full_name)
    @data[:tasks_link] = "#{ENV['DOMAIN']}/#/app/projects/#{project.id}/tasks"
    @data[:recipient_names] = recipient_names
	  if @user_task.re_issued?
  		@template_slug = APOSTLE_MAIL_TEMPLATE_SLUG[:complete_reassigned_task] #Complete re-issued Action/Document - Task Owner
		else	
			@template_slug = APOSTLE_MAIL_TEMPLATE_SLUG[:complete_new_task] # Complete Action/Document - Task Owner
		end
    if (@task.class.to_s == "Action")
      @attachments = @task.attachments
		end
		trigger_mail
	end

  #Review Action/Document - Task Approver
	def review_task 
		@data[:task_approver] = @task.approver.try(:full_name)
		@data[:task_name] = @task.title
    @data[:task_type] = @task.class.to_s.downcase
		@data[:task_owner] = @task.assigned_to.try(:full_name)
		@data[:recipient_names] = recipient_names
    @template_slug = APOSTLE_MAIL_TEMPLATE_SLUG[:review_task]
		trigger_mail
	end

  #Review Decision - Decision Owner
	def review_decision
		project = @task.project
		@data[:decision_owner] = @task.assigned_to.try(:full_name)
		@data[:decision_title] = @task.title
		@data[:project_name] = project.title
    @data[:recipient_names] = recipient_names
		@data[:decision_link] = "#{ENV['DOMAIN']}/#/app/projects/#{project.id}/tasks"
		@template_slug = APOSTLE_MAIL_TEMPLATE_SLUG[:review_decision]
		trigger_mail		
	end

	private

  def set_mail_receivers
    @receivers = []
    @receivers << @task.try(:project).try(:created_by) #project_owner
    @receivers << @task.assigned_to #task_owner
    unless (@task.class.to_s == "Decision")
      @receivers << @task.approver #task_approver
    end
  end

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

	def trigger_mail
		@receivers.compact.uniq.each do |receiver|
			mail = Apostle::Mail.new(@template_slug, email: receiver.email)
			mail.data = @data
			if @attachments.present?
				@attachments.each do |attachment|
					begin
						mail.attachments[attachment.file_attachment.file.filename] = Net::HTTP.get(URI.parse(attachment.file_attachment.url))
					rescue Exception => error
						puts error
					end
				end
			end
			mail.deliver!
		end
	end

	
end
