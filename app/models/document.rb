class Document < Task
  # There are no callbacks. If there were, you need to use :destroy instead of :delete_all\
  has_paper_trail on: [], meta: {
                            version_number: :set_version_number
                        }
  # acts_as_taggable_on :tags
  mount_base64_uploader :cover_page, CoverPageUploader
  mount_base64_uploader :logo, LogoUploader

  validates :title, presence: true
  validates :created_by_id, presence: true

  has_many :section_containers, -> { order(position: :asc) }, dependent: :destroy, inverse_of: :document
  has_many :section_texts, through: :section_containers
  has_many :images, dependent: :destroy
  has_many :comments, as: :commentable


  # after_create :set_default_approver
  after_create :set_default_collaborator
  # has_many :attachments

  amoeba do
    enable
    clone [:section_texts]
    exclude_association [:collaborations, :user_tasks,:project_workflow_steps]
    nullify :project_id
    nullify :assigned_to_id
    nullify :approver_id
    # set state: 0

    customize(lambda { |original_object,new_object|
      new_object.cover_page = original_object.cover_page.file
      new_object.logo = original_object.logo.file
    })

  end

  def linked_docs(user)
    Document
    .joins(:section_containers).where("section_text_id IN (?) and document_id <> ?",self.section_containers.collect(&:section_text_id),self.id )
    .select("distinct(tasks.id), project_id,title")
  end

  def set_version_number
    @next_version_number ||= (versions.maximum(:version_number) || 0)  + 1
  end

  def self.search(search)
    d1 =  self.joins(project: :category)
              .where("tasks.title ILIKE ? OR tasks.description ILIKE ? OR categories.name ILIKE ?","%#{search}%","%#{search}%","%#{search}%" ).recent
    # d2 =  self.joins(:tags)
    #           .where("tags.name ILIKE ?","%#{search}%" ).recent.pluck(&:id)
    Document.where(id: d1)
  end

  def self.generate_templates_for(user)
    if ENV['TEMPLATE_IDS'].present?
      ENV['TEMPLATE_IDS'].split(',').each do |id|
        doc = Document.find_by_id(id.to_i)
        TemplateService.new.create_template_from_existing(user: user, document: doc)
      end
    end
  end

  def revert_to(old_version:)
    update_params = old_version.object.except('approver_id','assigned_to_id','created_at','updated_at','cover_page','logo','state')
    # update_params.merge!({cover_page: open(old_version.object["cover_page"]["url"]) }) unless old_version.object["cover_page"]["url"].nil?
    # update_params.merge!({cover_page: open(old_version.object["logo"]["url"]) }) unless old_version.object["logo"]["url"].nil?
    update(update_params)
    version_number = old_version.version_number
    sections = get_particuler_version_section_texts(version_number)
    self.section_text_ids = sections.collect(&:section_text_id)
    self.section_texts.each do |section_text|
      section_text.revert_to(version_number: version_number)
    end
  end

  def set_default_collaborator
    if project.template_status == Project::REGULAR_PROJECT # Creating collaboration only for regular documents
      collaborations.create({collaborator: self.created_by,permission_level: 1, is_accepted: true})
    end
  end

  def accept_invitation(invitee)
    return false if already_accepted?(invitee)
    collaboration = collaborations.find_by_collaborator_id(invitee.id)
    if collaboration.present?
      collaboration.accept!
      notification_object = {document: self, user: invitee}
      NotificationMailer.new(notification_object).welcome_to_document
    else
      errors[:base] << 'No collaboration exist'
      return false
    end
  end

  def reject_invitation(invitee)
    return false if already_rejected?(invitee)
    collaboration = collaborations.find_by_collaborator_id(invitee.id)
    if collaboration.present?
      collaboration.reject!
    else
      errors[:base] << 'No collaboration exist'
      return false
    end
  end

  def has_collabration(user)
    collaborations.find_by_collaborator_id(user) || project.has_collabration(user) || collaborations.new
  end

  def duplicate(project:, created_by:)
    new_doc = self.amoeba_dup
    new_doc.project = project
    new_doc.created_by = created_by
    new_doc.archived = false
    new_doc.section_containers.each do |section_container|
      section_text = section_container.section_text
      section_text.project_id = project.id
      section_text.created_by_id = created_by.id
    end
    new_doc
  end

  # We cannot mark as archived the section_texts directly, as they may be used by other documents
  def archive!
    self.update(archived: true)
    NotificationMailer.new(self).document_toggle_archive
  end

  def un_archive!
    self.update(archived: false)
    NotificationMailer.new(self).document_toggle_archive
  end

  # Document data we want to report to segment analytics
  def reporting_properties
    {
      title: self.title,
      id: self.id,
      created_by: self.created_by&.reporting_properties,
      project: self.project&.reporting_properties
    }
  end


  def create_version
    section_containers.each do |section_container|
      section_container.create_container_version
    end
    self.paper_trail.touch_with_version
  end

  def can_access?(user)
    collaborators.include?(user) || project.collaborators.include?(user)
  end

  def display_doc_tree
    s = "#{self.id} -> Containers: #{self.section_containers.collect{|c| c.id}} and Texts: "\
    "#{self.section_texts.collect{|c| c.id}}, Pid: #{self.project_id} Created: #{self.created_by_id} "
    self.section_containers.each do |c|
      s+= "\n  -> Container: #{c.id} -> Texts: #{c.section_text.id}, Pid: #{c.section_text.project_id} Created: #{c.section_text.created_by_id} "
    end
    s
  end


  private
  def get_particuler_version_section_texts(version_num)
    PaperTrail::Version
      .where("item_type = 'SectionContainer' and object ->>'document_id' = '#{self.id}'  and  version_number = #{version_num}")
      .select("object ->> 'section_text_id' as section_text_id, object ->> 'section_text_id' as position, id")
      .order("object ->> 'position' asc ")
  end

  def already_rejected?(invitee)
    Collaboration.is_already_responded?(collaboration_object: self,collaborator: invitee,collaboration_status: false)
  end

  def already_accepted?(invitee)
    Collaboration.is_already_responded?(collaboration_object: self,collaborator: invitee,collaboration_status: true)
  end

end
