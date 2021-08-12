class WorkflowTemplateStep < ActiveRecord::Base
  attr_accessor :deleted,:template_communication_id

  enum state: [:not_started, :assigned, :working, :completed, :approved]
  scope :order_in_step, -> { order(:parent_step) }
  belongs_to :task, optional: true
  belongs_to :workflow_template, optional: true

  after_create :create_communication_template,if: proc { |step| step.node_type == "communication" and template_communication_id.present? }
  
  has_many :communications

  accepts_nested_attributes_for :communications, allow_destroy: true
  accepts_nested_attributes_for :task, allow_destroy: true
  before_create :remove_or_duplicate_task

  amoeba do
    enable
    nullify :workflow_template_id
  end

  def task_attributes=(task_attrs)
    if task_attrs['id']
      self.task = Task.find(task_attrs['id'])
      self.task.attributes = self.task.attributes.merge(task_attrs)
    else
      self.task = Task.new(task_attrs)
    end
  end

  def remove_or_duplicate_task
    if node_type.downcase == 'document'
      if task && !task.is_template? && task.is_a?(Document)
        self.task = _create_document_template
        self.node['data']['document_id'] = task_id
        self.node['document_id'] = task_id
      end
    elsif node_type.downcase == 'action'
      dup_task = task.amoeba_dup
      dup_task.save
      self.task = dup_task
    else
      self.task_id = nil if task.present?
    end
  end

  def create_communication_template
    template_communication_id.each do |communication_id|
      communication = Communication.find_by_id(communication_id)
      next if communication.nil?
      copy_communication = communication.amoeba_dup
      copy_communication.workflow_template_step = self
      copy_communication.save
    end
  end

  private

    def _create_document_template
      created_by =  workflow_template.created_by
      template_document = TemplateService.new.create_template_from_existing(user: created_by, document: task)
      template_document.save
      template_document
    end

end
