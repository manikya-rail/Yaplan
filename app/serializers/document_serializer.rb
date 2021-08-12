class DocumentSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :category_name,:archived, :project_id, :project_name, :proposed_startdate, :proposed_enddate, :collaborator_count, :created_at, :updated_at, :collaborators, :state, :is_public, :is_template,:cover_page,:header,:footer, :logo, :subtitle, :show_contents, :show_cover, :assigned_to_id, :approver_id, :type, :published,:show_page_number
  # has_many :section_containers, include: :section_text # serializer: SectionContainerSerializer
  # has_many :section_containers, include: { section_containers: :section_text}
  has_many :section_containers, include: '*.*.*'
  has_many :images
  #has_many :collaborators, serializer: UserCollaboratorSerializer
  belongs_to :created_by, serializer: UserCollaboratorSerializer
  belongs_to :approver, serializer: UserCollaboratorSerializer
  belongs_to :project, serializer: OptProjectSerializer
  belongs_to :assigned_to, serializer: UserCollaboratorSerializer
  has_many :tags, serializer: TagSerializer
  # has_many :section_containers, include: :section_text # serializer: SectionContainerSerializer
  # has_many :posts, include: { author: [:bio], comments: [:author]] }


  def is_template
    object.is_template?
  end

  def versions
    object.versions.select(:created_at,:id,:whodunnit)
  end

  def category_name
    object.project.category.name if object.project.present?
  end

  def project_name
    object.project.title if object.project.present?
  end

  def collaborators
    collaborations = get_active_collaborations(object)
    collaborations += get_active_collaborations(object.project)
    collaborations.uniq!
    c_arr = []
    collaborations.each do |c|
      c_arr << {id: c.id, name: c.full_name, email: c.email, portrait: c.portrait}
    end
    c_arr
  end

  def collaborator_count
   collaborators.count
  end

  def get_active_collaborations(_obj)
    _obj.collaborators.where("collaborations.is_accepted = ?",true)
  end

end
