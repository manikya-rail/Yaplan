class ProjectWorkflow < ActiveRecord::Base

  attr_accessor :workflow_steps_attributes

  mount_base64_uploader :snapshot, SnapshotUploader

    # default_scope do
    #   includes(project_workflow_steps: [communications: [:attachments]])
    # end
  scope :recent, -> {order(updated_at: :DESC)}

  validates :project, presence: true
  validates :name, presence: true

  belongs_to :project, optional: true
  has_one :category, through: :project
  has_one :created_by, through: :project
  belongs_to :workflow_template, optional: true
  has_many   :project_workflow_steps, dependent: :destroy
  after_create :create_workflow_steps
  accepts_nested_attributes_for :project_workflow_steps, allow_destroy: true
  has_many :tasks, through: :project_workflow_steps

  def self.search(options)
    if options.empty?
      recent
    else
      search = options[:search]
      recent.where("project_workflows.name ILIKE ? OR project_workflows.description ILIKE ? OR categories.name ILIKE ?", "%#{search}%", "%#{search}%", "%#{search}%")
    end
  end

  def self.search_by_document(document_id:)
    if document_id.present?
      joins(:project_workflow_steps).where(project_workflow_steps: {task_id: document_id})
    end
  end

  def self.create_workflow(template:,project:)
	  create(project: project,name: project.title,description: template.description,workflow_template: template)
  end

  def create_workflow_steps
    project_workflow_steps.create!(santized_attributes) unless workflow_template.nil?
  end

  def save_as_template
    template = create_workflow_tempate
    template.workflow_template_steps.create(sanitize_template_attributes)
  end

  def update_lock!
    update(locked: !locked?)
  end

  def get_working_step
    workflow_templates.working
  end

  def start_node
    project_workflow_steps.where(node_type: 'startStop').find_by("(node->>'edges') != '{}'")
  end

  def end_node
    project_workflow_steps.where(node_type: 'startStop').find_by("(node->>'edges') = '{}'")
  end

  def first_nodes
    edges = start_node.node["edges"].is_a?(Hash) ? start_node.node["edges"].values : start_node.node["edges"]
    targets = edges.map do |edge|
      edge["data"]["target"].slice(1..-1).to_i
    end
    project_workflow_steps.where(step_id: targets)
  end

  def create_task_for_steps
    project_workflow_steps.each do |step|
      step.assign_task_to_step
      step.save
    end
  end

  def reporting_properties
    { 
      name: name, 
      project: project.reporting_properties,
      workflow_template: workflow_template.reporting_properties
    }
  end 

  private

  def create_workflow_tempate

    template = WorkflowTemplate.create(
                            name: name,
                            category_id: self.project.category_id,
                            created_by_id: self.project.created_by_id,
                            description: self.description,
                          )
    CopyCarrierwaveFile::CopyFileService.new(self, template, :snapshot).set_file if self.snapshot.present?
    template.save
    template
  end

  def santized_attributes
    workflow_template.workflow_template_steps.collect do |step|
      step.attributes.except!("workflow_template_id", "id").merge!(template_communication_id: step.communications.collect(&:id))
    end
  end

  # Remove template attributes
  def sanitize_template_attributes
    project_workflow_steps.collect do |step|
      step.attributes.except!("id", "project_workflow_id", "state").merge!(template_communication_id: step.communications.collect(&:id))
    end
  end
end
