class ProjectWorkflowStep < ActiveRecord::Base
  attr_accessor :assigned_to_id, :approver_id,:template_communication_id
  enum state: [:created, :working, :completed]

  default_scope { includes(:task, communications: [:attachments]) }
  scope :order_in_step, -> { order(:step_id) }

  belongs_to :project_workflow, optional: true
  belongs_to :workflow_template, optional: true
  belongs_to :task, optional: true


  before_save :assign_task_to_step, if: proc { |step| step.task_id_changed? or step.new_record?  }
  after_create :create_communication,if: proc { |step| step.node_type == "communication" && template_communication_id.present? }

  delegate :assigned_to, to: :task, allow_nil: true
  delegate :approver, to: :task, allow_nil: true
  delegate :created_by, to: :task, allow_nil: true
  # delegate :state, to: :task, prefix: true

  has_many :communications, dependent: :destroy

  accepts_nested_attributes_for :communications, allow_destroy: true
  accepts_nested_attributes_for :task, allow_destroy: true
  
  def task_attributes=(task_attrs)
    if task_attrs['id']
      self.task = Task.find(task_attrs['id'])
      if node_type == "document"
        if self.task.is_template?
          self.assigned_to_id = task_attrs['assigned_to_id']
          self.approver_id = task_attrs["approver_id"]
        end
      end
      self.task.attributes = self.task.attributes.except!("cover_page", "logo",'updated_at','created_at').merge(task_attrs)
    else
      self.task = Task.new(task_attrs.merge(project_id: self.project_workflow.project_id))
    end
  end

  def state
    if node_type == 'startStop'
      start_stop_state
    else
      super
    end
  end

  def create_communication
    template_communication_id.each do |communication_id|
      communication = Communication.find_by_id(communication_id)
      next if communication.nil?
      copy_communication = communication.amoeba_dup
      copy_communication.project_workflow_step = self
      copy_communication.save
    end
  end

  def assign_task_to_step
    project = project_workflow.project
    if node_type.downcase == 'document'
      self.task = _create_duplicate_document if self.task && (self.task.is_template? || (self.task.project_id != project.id) )
    elsif node_type.downcase == 'decision'
      self.task = Decision.create(title: node['data']['text'], project: project, description: description) if task_id.nil?
    elsif node_type.downcase == 'action'
      if self.task.nil?
        self.task = Action.create(title: node['data']['text'], project: project, description: description)
      elsif task.project_id.nil?    
        dup_task = self.task.amoeba_dup
        dup_task.project_id = project.id
        dup_task.save
        self.task = dup_task
      end
    end
  end

  def set_as_working!
    update(state: :working)
  end

  def set_as_completed!
    update(state: :completed)
    if node_type == 'communication' && communications.present?
      previous_step = _previous_steps.first
      communications.instance_eval(previous_step.task.try(:state)).each do |communication|
        communication.trigger_communication if communication.present?
      end
    end
  end

  def trigger_all_the_reject_communications
    next_communication_steps = next_steps.joins(:communications).where(node_type: 'communication',communications: {communication_mode: 1})
    next_communication_steps.each(&:set_as_completed!)
  end


  def next_steps
    if node_type == 'document' || node_type == 'action' || node_type == 'startStop'
      edges = node["edges"].is_a?(Hash) ? node["edges"].values : node["edges"]
      targets = (edges || []).collect do |edge|
        edge["data"]["target"].slice(1..-1).to_i
      end
    elsif node_type == 'decision'
      targets = node['decision']['YES']
    end
    return project_workflow.project_workflow_steps.where(step_id: targets)
  end

  def all_previous_steps_is_approved?
    uncompleted_steps = _previous_steps.joins(:task).where("tasks.state < ? and tasks.state > ? ",5,0) # Get all uncompleted tasks
    uncompleted_steps.empty? #return true if all the  previous tasks are completed
  end

  def previous_step_title
    _previous_steps.first.task.title unless _previous_steps.collect(&:task).compact.empty?
  end

  def parent_step
    ProjectWorkflowStep.find_by_step_id_and_project_workflow_id(parent_step_id, project_workflow_id)
  end

  def send_notifications
    # to send notification TODO
  end

  def get_reject_decision_steps
    target = node['decision']['NO']
    project_workflow.project_workflow_steps.where(step_id: target)
  end


  private

  def _create_duplicate_document
    project = self.project_workflow.project
    document = task.duplicate(
                project: project,
                created_by: project.created_by,
              )
    document.assigned_to_id = self.assigned_to_id unless self.assigned_to_id.nil?
    document.approver_id= self.approver_id unless self.approver_id.nil?
    document.is_public = false
    document.save
    document
  end

  def _previous_steps
    project_workflow.project_workflow_steps.where(
      "(node->>'edges') like ?", "%target\":\"n#{step_id}\"%"
    )
  end

  def start_stop_state
    if next_steps.present?
      this_state = project_workflow.project.start_at ? 'approved' : 'created'
    elsif _previous_steps.present?
      states = _previous_steps.collect { |step| step.task.state if step.task }
      this_state = states.compact.uniq == ['approved'] ? 'approved' : 'created'
    else
      this_state = 'created'
    end
    this_state
  end
end
