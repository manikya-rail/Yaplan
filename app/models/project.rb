class Project < ActiveRecord::Base
  #searchkick
  include PublicActivity::Common
  attr_accessor :workflow_template_id

  REGULAR_PROJECT = 1
  DOCUMENT_TEMPLATE = 2
  PROJECT_TEMPLATE = 3

  validates :created_by, presence: true
  validates :title, presence: true
  validates :category, presence: true

  scope :active, -> { where(archived: false) }
  scope :regular, -> { where(template_status: REGULAR_PROJECT) }
  scope :recent, -> { order(updated_at: :DESC) }
  scope :archived, -> { where(archived: true) }

  belongs_to :created_by, class_name: 'User', optional: true
  belongs_to :category, optional: true

  has_one  :project_workflow, dependent: :destroy
  has_many :project_workflow_steps, through: :project_workflow

  has_many :collaborations, as: :collaboration_level
  has_many :collaborators, through: :collaborations

  has_many :section_texts, dependent: :destroy
  has_many :comments, as: :commentable

  has_many :tasks
  has_many :recent_tasks, -> { order(updated_at: :desc) }, class_name: 'Task'

  has_many :documents, dependent: :destroy

  after_create :send_confirmation_mailer_to_owner
  after_create :set_default_collaborator
  after_create :create_project_workflow, if: proc { |project| project.workflow_template_id.present? }

  def self.search(keyword)
    joins(:category)
    .where("projects.title ILIKE ? OR projects.description ILIKE ? OR categories.name ILIKE ?","%#{keyword}%","%#{keyword}%","%#{keyword}%")
  end  

  def change_category!(category_id)
    update(category_id: category_id)
  end 

  def create_project_workflow
    template = WorkflowTemplate.find(workflow_template_id)
    project_workflow = ProjectWorkflow.create(project: self, name: title,description: description, workflow_template: template)
    CopyCarrierwaveFile::CopyFileService.new(template, project_workflow, :snapshot).set_file if template.snapshot.present?
    project_workflow.save!
  end

  def archive!
    update(archived: true)
    documents.each { |document| document.update(archived: true) }
    NotificationMailer.new(self).project_toggle_archive
  end

  def un_archive!
    update(archived: false)
    documents.each { |document| document.update(archived: false) }
    NotificationMailer.new(self).project_toggle_archive
  end

  def started?
    start_at.present?
  end

  def send_confirmation_mailer_to_owner
    if template_status == 1
      NotificationMailer.new(self).project_created
    end
  end

  def all_pending_invitees_of_tasks
    assigned_to_ids = tasks.collect(&:assigned_to_id).compact
    approver_ids = tasks.collect(&:approver_id).compact
    collaborator_ids = assigned_to_ids | approver_ids
    collaborations.where("(is_accepted is null or is_accepted = ?) and collaborator_id IN (?)",false,collaborator_ids)
  end


  def set_default_collaborator
    if template_status == 1 # Creating collaboration only for regular projects
      collaborations.create({ collaborator: created_by, permission_level: 2, is_accepted: true })
    end
  end

  def all_collaborations #project and it's document level collaborations
    document_collabs = documents.collect(&:collaborations).flatten.uniq(&:collaborator_id)
    project_collabs = collaborations.uniq(&:collaborator_id)
    accepted_project_collabs = project_collabs.select(&:is_accepted).map(&:collaborator_id)

    document_collabs.each do |document_collab|
      if accepted_project_collabs.include? document_collab.collaborator_id
        document_collabs.delete(document_collab)
      end
    end
    collaborations = (project_collabs + document_collabs).sort_by(&:collaborator_id)
  end

  # list of accepted invitees for a project (members)
  def accepted_invitees
    (collaborations.where(is_accepted: true) + Collaboration.where(collaboration_level: documents, is_accepted: true)).uniq(&:collaborator_id)
  end

  def all_invitees
    collaborations.where.not(invited_by: nil) #excluding the owner of project
  end

  def has_workflow?
    self.project_workflow.present?
  end

  def remove_existing_workflow!
    project_workflow.destroy
    tasks.each do |task|
      if task.is_a?(Document) 
        task.user_tasks.destroy_all
      else
        task.destroy
      end
    end
  end

  def assign_first_task
    project_workflow.first_nodes.each do |node|
      if node.task.assigned_to
        node.task.set_as_assigned! # To avoid start step
      else
        node.task.set_as_paused! 
      end
    end
  end

  def set_as_completed!
    update(end_at: DateTime.current)
    NotificationMailer.new(self).project_completed
  end

  def accept_invitation(invitee)
    if already_accepted?(invitee)
      errors[:base] << 'You have already accepted the invitation!'
      return false
    elsif already_rejected?(invitee)
      errors[:base] << "You have already rejected the invitation. Invitation expired!"
      return false
    end
    collaboration = collaborations.find_by_collaborator_id(invitee.id)
    if collaboration.present?
      collaboration.accept!
      notification_object = {project: self, user: invitee}
      NotificationMailer.new(notification_object).welcome_to_project
    else
      errors[:base] << 'No collaboration exist'
      return false
    end
  end

  def reject_invitation(invitee)
    if already_rejected?(invitee)
      errors[:base] << 'You have already rejected the invitation!'
      return false
    elsif already_accepted?(invitee)
      errors[:base] << "You cannot perform this action as you are already a collaborator. Invitation expired!"
      return false
    end
    collaboration = collaborations.find_by_collaborator_id(invitee.id)
    if collaboration.present?
      collaboration.reject!
      NotificationMailer.new(collaboration).project_invitation_rejected
    else
      errors[:base] << 'No collaboration exists!'
      return false
    end
  end

  # Project data we want to report to segment analytics
  def reporting_properties
    {
      id: id,
      title: title,
      created_by: created_by.reporting_properties
    }
  end

  def can_access?(user)
    user.all_collaborated_projects.map(&:id).include? self.id
  end

private

  def already_rejected?(invitee)
    Collaboration.is_already_responded?(collaboration_object: self,collaborator: invitee,collaboration_status: false)
  end

  def already_accepted?(invitee)
    Collaboration.is_already_responded?(collaboration_object: self,collaborator: invitee,collaboration_status: true)
  end

end
