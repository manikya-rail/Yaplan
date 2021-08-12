class UserTask < ActiveRecord::Base

  enum response_status: [:accepted, :rejected, :completed, :not_responded]
  enum task_type: [:approve, :decision, :assign]
  default_scope { includes(:task) }
  scope :recent, -> { order(created_at: :DESC) }
  belongs_to :user, optional: true
  belongs_to :task, optional: true
  after_create :send_notification_mail, on: :create, if: proc { |user_task| user_task.user.present? }
  after_commit :trigger_user_task_complete_notification_email, on: :update

  def set_as_accepted!
    track_activity
    if task_type == 'assign'
      task.set_as_published!
      update(response_status: :completed)
    else
      task.set_as_approved!
      update(response_status: :accepted)
    end
  end

  def set_as_rejected!
    task.create_activity :rejected, owner: user, recipient: task.project, params: { message: response_message }
    task.set_as_rejected!
    update(response_status: :rejected)
  end

  def re_issued?
    task.user_tasks.count > 2
  end

  def send_notification_mail
    user_task_notification_mailer = UserTaskNotificationMailer.new(self)
    task = self.task
    if task.is_a?(Document) || task.is_a?(Action)
      if task_type == "assign"
        user_task_notification_mailer.complete_task
      elsif task_type == "approve"
        user_task_notification_mailer.review_task
      end
    elsif task.is_a?(Decision)
      if task_type == "decision"
        user_task_notification_mailer.review_decision
      end
    end
    Analytics.track(
      user_id: user.segment_id,
      event: "Task Assigned",
      properties: {
        task_id: task.id,
        task_object: task.type,
        task_type: task_type
      }
    )
  end

  def trigger_user_task_complete_notification_email
    if previous_changes.include?(:response_status)
      task_notification_mailer = TaskNotificationMailer.new(self)
      task = self.task
      if task.is_a?(Document) || task.is_a?(Action)
        if task_type == 'assign'
          task_notification_mailer.delay.task_issued_for_approval
        elsif task_type == 'approve'
          task_notification_mailer.delay.task_approver_response
        end
      elsif task.is_a?(Decision)
        task_notification_mailer.delay.inform_decision_response
      end
    end
  end

  # checking user tasks is valid

  # def can_update_task? 
  #   if task_type == 'approve'
  #     user === task.approver
  #   else
  #     user === task.assigned_to
  #   end
  # end

  private

  def track_activity
    activity_key = (task_type == 'assign' ? :submitted : :approved)
    task.create_activity activity_key, owner: user, recipient: task.project, params: { message: response_message }  
  end
end
