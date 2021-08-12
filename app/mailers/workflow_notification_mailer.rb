class WorkflowNotificationMailer 

  APOSTLE_MAIL_TEMPLATE_SLUG = {
    "workflow_assigned": "workflow-assigned",
    "workflow_updated": "workflow-updated",
    "triggered_workflow_lock": "triggered-workflow-lock"
  }

  def initialize(project_workflow)
    @workflow = project_workflow
    @project_owner = project_workflow.project.created_by
    @project = project_workflow.project
    @data = {}
  end

  #Notification - Project Owner - Workflow Assigned
  def workflow_assigned
    @data[:owner_name] = @project_owner.try(:full_name)
    @data[:project_title] = @project.try(:title)
  	@data[:workflow_name] = @workflow.workflow_template.try(:name)
    @data[:document_list] = @workflow.project.documents.map(&:title).join(", ")
  	@data[:workflow_link] = "#{ENV['DOMAIN']}/#/app/projects/#{@project.id}/workflow"
    @receiver = @project_owner
    @template_name = APOSTLE_MAIL_TEMPLATE_SLUG[:workflow_assigned]
    set_mail_object
  end

  #Notification - Project Owner - Workflow Updated
  def workflow_updated
    @data[:owner_name] = @project_owner.try(:full_name)
    @data[:project_title] = @project.try(:title)
    @data[:workflow_link] = "#{ENV['DOMAIN']}/#/app/projects/#{@project.id}/workflow"
    @receiver = @project_owner
    @template_name = APOSTLE_MAIL_TEMPLATE_SLUG[:workflow_updated]
    set_mail_object
  end

  #Notification - Project Owner - Workflow Lock / Unlock
  def triggered_workflow_lock
    @data[:owner_name] = @project_owner.try(:full_name)
    @data[:project_title] = @project.try(:title)
  	@data[:lock_state] = @workflow.locked ? "locked" : "unlocked"
    locked_text = "Nobody will be able to make changes to the workflow until you unlock it (but they can still complete their tasks)"
    unlocked_text = "This means anyone can make changes to your workflow"
    @data[:status_text] = @workflow.locked ? locked_text : unlocked_text
  	@data[:login_link] = "#{ENV['DOMAIN']}/#/reg/login"
    @receiver = @project_owner
    @template_name = APOSTLE_MAIL_TEMPLATE_SLUG[:triggered_workflow_lock]
    set_mail_object
  end

  private

  def set_mail_object
    mail = Apostle::Mail.new(@template_name, email: @receiver.email)
    mail.data = @data
    mail
  end
    
end
