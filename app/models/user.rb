class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  # devise :database_authenticatable, 
  #        :recoverable, :rememberable, :trackable, :validatable
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable

  attr_accessor :invitation_type, :invitation_message

  devise :database_authenticatable, 
         :recoverable, :trackable, :validatable,
         :invitable, :confirmable,
         :rememberable, :registerable,
         :token_authenticatable

  validates :email, presence: true
  validates :email, uniqueness: true
  validates :first_name, presence: true
  validates :last_name, presence: true


  before_create :set_default_role

  scope :active, -> { where(active: true) }

  belongs_to :plan, optional: true
  belongs_to :role, optional: true
  belongs_to :charge_plan, inverse_of: :users, optional: true
  has_one  :portrait, dependent: :destroy


  has_many :authentication_tokens, dependent: :destroy
  has_many :projects, foreign_key: :created_by_id
  has_many :documents, foreign_key: :created_by_id
  has_many :section_texts
  
  has_many :assigned_tasks, class_name: 'Task', foreign_key: :assigned_to_id
  has_many :assigned_documents, class_name: 'Document', foreign_key: :assigned_to_id
  has_many :approve_documents, class_name: 'Document', foreign_key: :approver_id
  has_many :user_tasks, dependent: :destroy

  has_many :workflow_templates, foreign_key: :created_by_id

  has_many :collaborations, foreign_key: 'collaborator_id', dependent: :destroy
  has_many :collaborated_projects, through: :collaborations, source: :collaboration_level, source_type: 'Project'
  has_many :collaborated_documents, through: :collaborations, source: :collaboration_level, source_type: 'Task'

  # has_and_belongs_to_many :collaborated_documents, join_table: :document_collaborators, class_name: 'Document'

  after_create :set_default_plan

  def all_collaborated_projects
    doc_project_ids = all_collaborated_documents.joins(:collaborations).where("collaborations.is_accepted": true).active.select(:project_id)
    collab_project_ids = collaborated_projects.joins(:collaborations).where("collaborations.is_accepted": true).active.select(:id)
    Project.where(id: doc_project_ids + collab_project_ids)
  end

  def all_collaborated_documents
    collaborated_documents.where("collaborations.is_accepted": true).active.recent
  end

  def find_collaborated_users(name: nil, email: nil)
    project_ids = collaborated_projects.pluck(:id)
    if name.present?
      User.joins(:collaborations).where(collaborations: {collaboration_level_id: project_ids} ).where("users.first_name ILIKE ?", "%#{name}%").where.not(id: self.id).uniq
    elsif email.present?
      User.joins(:collaborations).where(collaborations: {collaboration_level_id: project_ids} ).where("users.email ILIKE ?", "%#{email}%").where.not(id: self.id).uniq
    end
  end 

  def archive!
    update(is_archived: true)
  end

  def un_archive!
    update(is_archived: false)
  end

  def phone
    "+" + contry_code.to_s + phone_number.to_s
  end

  def set_default_plan
    @plan = Plan.find_by_amount('0.0')
    update_attribute('plan_id', @plan.id) if @plan.present?
  end

  def segment_id
    id
  end

 def full_name
    first_name.to_s + " " + last_name.to_s
  end 

  def activate!
    update(active: true)
  end

  def deactivate!
    update(active: false)
  end

  # collaboration object - document/project
  def self.collaboration_invite!(attributes:)
    user = User.invitation_accepted.find_by_email(attributes[:email])
    invited_by = attributes[:invited_by]
    if user.present?
      CollaborationInvitationMailer.collaboration_notification(attributes.merge(invitee: user)).deliver_now!
    else
      user = invite!(attributes, invited_by)
    end
    notification_object = {invited_by: invited_by,collaborator: user,collaboration_object: attributes[:invitation_type], message: attributes[:invitation_message]}
    NotificationMailer.new(notification_object).user_invited
    user
  end

  def invitation_accepted?
    invitation_accepted_at.present?
  end

  def admin?
    role_id.present? ? role.name == 'admin' : false
  end

  def segment_traits
    {
      email: email,
      full_name: full_name
    }
  end

  def project_count
    projects.count
  end

  def availabile_projects
    collaborated_documents_project_id  = collaborated_documents
                          .where("is_accepted = ? or is_accepted is ?",true,nil)
                          .select("distinct project_id as id")
    collaborated_projects_id = collaborated_projects
                          .where("is_accepted = ? or is_accepted is ?",true,nil)
                          .select("distinct projects.id id")
    Project.where(id: (collaborated_projects_id.to_a + collaborated_documents_project_id.to_a) )
  end

  def active_for_authentication?
    super && self.active
  end

  def inactive_message
    if confirmed_at.nil?
      "Confirm your email" 
    else
      "Sorry, this account has been temporarly deactivated."
    end
  end

  def reporting_properties
    {
      user_id: segment_id,
      user_name: full_name,
      user_email: email
    }
  end

  private

  def set_default_role
    self.role ||= Role.find_by_name('normal_user')
  end
end
