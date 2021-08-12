class DocumentIndexSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :category_name,:archived, :project_id, :project_name, :collaborators, :proposed_startdate, :proposed_enddate, :created_at, :updated_at, :state, :is_public, :is_template,:assigned_to_id, :approver_id, :published, :linked_documents, :created_by_id, :type, :cover_page, :header, :footer, :logo, :subtitle, :show_contents, :show_cover, :show_page_number

  # has_many :section_containers, include: :section_text # serializer: SectionContainerSerializer
  # has_many :section_containers, include: { section_containers: :section_text}
  #has_many :collaborators, serializer: UserCollaboratorSerializer
  belongs_to :created_by, serializer: UserCollaboratorSerializer, optional: true
  belongs_to :approver, serializer: UserCollaboratorSerializer, optional: true
  belongs_to :project, serializer: OptProjectSerializer, optional: true
  belongs_to :assigned_to, serializer: UserCollaboratorSerializer, optional: true

  def is_template
    object.is_template?
  end

  def category_name
    object.project.category.name if object.project.present?
  end

  def project_name
    object.project.title if object.project.present?
  end

  def collaborators
    collaborations = get_active_collaborations(object)
    collaborations += get_active_collaborations(object)
    collaborations.uniq!
    c_arr = []
    collaborations.each do |c|
      c_arr << {id: c.id, name: c.full_name, email: c.email
      }
    end
    c_arr
  end

  def linked_documents
    documents = object.linked_docs(current_user)
    arr = []
    unless (documents.empty? || documents.include?(nil) )
      documents.each do |doc|
        accessible = doc.can_access?(current_user)
        (arr << { id: doc.id , title: doc.title , accessible: accessible} ) if !(doc == object)
      end
    end 
    return arr.empty? ? nil : arr
  end

  def get_active_collaborations(_obj)
    _obj.collaborators.where("collaborations.is_accepted = ?",true)
  end

end
