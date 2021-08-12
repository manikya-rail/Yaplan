class Task < ActiveRecord::Base

  include PublicActivity::Common

  enum state: [:created, :assigned, :draft, :working, :published, :approved, :rejected, :paused]

  scope :archived, -> { where(archived: true) }
  scope :active, -> { where(archived: false) }
  scope :recent, -> { order(updated_at: :DESC) }
  scope :public_templates, -> { where(is_public: true) }

  belongs_to :created_by, class_name: 'User', optional: true
  belongs_to :approver, class_name: 'User', optional: true
  belongs_to :assigned_to, class_name: 'User', optional: true
  belongs_to :project, optional: true

  has_many :project_workflow_steps
  has_many :comments, as: :commentable
  has_many :user_tasks, dependent: :destroy
  has_many :collaborations, as: :collaboration_level
  has_many :collaborators, through: :collaborations
  has_many :attachments, as: :attachmentable
  accepts_nested_attributes_for :attachments, allow_destroy: true
  
  after_commit :trigger_next_step, on: :update

  Task.states.keys.each do |state|
    define_method "set_as_#{state}!" do
      update(state: state)
    end
  end

  def trigger_next_step
    if previous_changes.include?(:state) or previous_changes.include?(:assigned_to_id) or previous_changes.include?(:approver_id) 
      if project_workflow_steps.present?
        current_step = project_workflow_steps.first # TODO: multipile step for a task

        if approved? # if task got approved
          # next_steps = current_step.next_steps.flatten
          next_steps = current_step.next_steps
          next_steps.each do |next_step|
            if next_step.node_type != "startStop"
              current_step.set_as_completed!
              if next_step.node_type == 'communication'
                next_step.set_as_completed! if next_step.communications.where(communication_mode: 0).present?
              else  
                check_to_proceed_next_task(next_step) if next_step.all_previous_steps_is_approved?
              end
            else
              project.set_as_completed!
              project.create_activity :completed, owner: project_owner, recipient: project
            end
          end

        elsif assigned? # if task got assigned
          current_step.set_as_working!
          task_type = type.casecmp('decision').zero? ? :decision : :assign
          user_tasks.create(user: assigned_to, task_type: task_type)
        elsif published? # if is got approved
            user_tasks.create(user: approver, task_type: :approve)
            self.create_version  if self.is_a?(Document)
        elsif rejected?
          if self.is_a?(Document) or self.is_a?(Action)
            current_step.trigger_all_the_reject_communications
            set_as_assigned!
          else
            next_steps = current_step.get_reject_decision_steps
            next_steps.each do |next_step|
              if next_step.node_type != "startStop"
                check_to_proceed_next_task(next_step)
              else
                project.set_as_completed!
                project.create_activity :completed, owner: project_owner, recipient: project
              end
            end
            current_step.set_as_completed!
          end
        elsif paused?
           if assigned_to_id.present?
              set_as_assigned!
           else
            self.create_activity :paused, owner: project_owner, recipient: project_owner
           end
        end

      else # to create tasks for - project without workflow
        if assigned?
          user_tasks.create(user: assigned_to, task_type: :assign)
        elsif published?
          user_tasks.create(user: approver, task_type: :approve)
        elsif rejected?
          set_as_assigned!
        end
      end
    end
  end

  def is_template?
    !project || project.template_status == Project::DOCUMENT_TEMPLATE
  end

  def previous_task_title
    step = project_workflow_steps.first
    title = ""
    title = step.previous_step_title if step
  end

  private

    def check_to_proceed_next_task(next_step)
      next_task = next_step.task
      if next_task
        if next_task.assigned_to_id.present?
          next_task.set_as_assigned!
        else
          next_task.set_as_paused!
        end
      end
    end

    def project_owner
      self.project.created_by
    end

end
