
class WorkflowTemplate < ActiveRecord::Base
  attr_accessor :workflow_steps
  validates :name, presence: true

  scope :active, -> { where(archived: false)}
  scope :published, -> {where(published: true)}
  scope :recent, -> { order(updated_at: :DESC) }
  scope :public_template, ->{where(is_public: true)}

  belongs_to :category, optional: true
  belongs_to :created_by, class_name: 'User', foreign_key: 'created_by_id', optional: true
  has_one :document_template, class_name: "Task"
  has_many :workflow_template_steps, dependent: :destroy
  mount_base64_uploader :snapshot, SnapshotUploader
  accepts_nested_attributes_for :workflow_template_steps, allow_destroy: true

  # after_create :create_steps

  amoeba do
    enable
    nullify [:published, :archived, :category_id, :created_by_id]
  end

  # def create_steps # TODO: Error Handling
  #   workflow_template_steps.create(workflow_steps) if workflow_steps.present?
  # end

  def self.search_by_document_tempate(document_template_id:)
      joins(:workflow_template_steps).where(workflow_template_steps: {task_id: document_template_id}).group(:id,:task_id)
  end

  def self.search(options)
    if options.empty?
      recent
    else
      search = options[:search]
      recent.joins(:category).where("workflow_templates.name ILIKE ? OR workflow_templates.description ILIKE ? OR categories.name ILIKE ?","%#{search}%","%#{search}%","%#{search}%")
    end
  end

  def archive!
    update(archived: true)
  end

  def un_archive!
    update(archived: true)
  end

  def publish!
    update(published: true)
  end

  def reporting_properties
    {
      name: name,
      category: category.name
    }
  end
end
