class TaskNotificationMailer
#NOTIFICATIONS - For multiple users linked with the entity
	APOSTLE_MAIL_TEMPLATE_SLUG = {
		task_issued: "task-issued",
		task_reviewed: "task-reviewed",
		decision_status_notification: "decision-status"
	}

	def initialize(user_task)
		@user_task = user_task
		@data = {"login_link": "#{ENV['DOMAIN']}/#/reg/login"}
		@template_name = ''
    @task = user_task.task
    set_mail_receivers
	end

  # Task (Document / Action ) is issued - TO :task_owner, :task_approver, :project_owner
	def task_issued_for_approval
		get_task_details
		@template_name = APOSTLE_MAIL_TEMPLATE_SLUG[:task_issued]
		set_task_issue_mode
		trigger_user_specific_emails
	end

  # Task reviewed (Document / Action) - TO :task_owner, :task_approver, :project_owner
	def task_approver_response
		get_task_details
		@template_name = APOSTLE_MAIL_TEMPLATE_SLUG[:task_reviewed]
		@data[:task_response] = @user_task.response_status.humanize
		@data[:task_comment] = @user_task.response_message
		trigger_user_specific_emails
	end

  # Decision Status - TO :task_owner, :project_owner
	def inform_decision_response
		@data[:project_name] = @task.project.title
		@data[:decision_status] = @user_task.response_status.humanize
		@data[:decision_owner] = @user_task.user.try(:full_name)
    @data[:recipient_names] = recipient_names
		@data[:decision_comment] = @user_task.try(:response_message)
		@data[:decision_title] = @task.title
		@data[:previous_task_name] = @task.previous_task_title
		@template_name = APOSTLE_MAIL_TEMPLATE_SLUG[:decision_status_notification]
		trigger_user_specific_emails	
	end

	private

	def trigger_user_specific_emails
		@receivers.compact.uniq.each do |receiver|
			mail = Apostle::Mail.new(@template_name, email: receiver.email )
			@data[:receiver_name] = receiver.full_name
			mail.data = @data
			mail.deliver!
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

	def set_mail_receivers
		@receivers = []
  	@receivers << @task.project.try(:created_by) #project_owner
		@receivers <<	@task.assigned_to #task_owner
    unless (@task.class.to_s == "Decision")
		  @receivers <<	@task.approver #task_approver
	  end
  end

	def get_task_details
		@data[:task_type] = @task.type.downcase
		@data[:project_name] = @task.project.try(:title)
		@data[:task_name] = @task.title
    @data[:task_owner] = @task.assigned_to.try(:full_name)
    @data[:task_approver] = @task.approver.try(:full_name)
		@data[:recipient_names] = recipient_names
  end

	def set_task_issue_mode
		@data[:task_mode] =  @user_task.re_issued? ? "re-issued" : "issued"
	end

end