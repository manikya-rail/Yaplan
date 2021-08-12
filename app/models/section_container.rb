class SectionContainer < ActiveRecord::Base
  # The Section container is specific to each document
  # The section text it contains / references on the other hand,
  # may be shared by several section containers
  has_paper_trail on: [], meta: {
                            version_number: :get_version_number 
                        }
  
  belongs_to  :document, optional: true
  belongs_to  :section_text, optional: true
  acts_as_list scope: :document
  validates :section_text, presence: true
  validates :document, presence: true
  has_many :comments, as: :commentable

  # validates :document, :presence => true

  # amoeba do
  #   enable
  #     clone [:section_text]
  # end

  def after=(other_id)
    self.position =
      if other_id == 0
        1
      else
        SectionContainer.find(other_id).position + 1
    end
    save
  end

  def linked_docs(user)
    Document.select(:id,:title,:project_id).where.not(id: document_id).joins(:section_containers).where("section_text_id = ?", section_text_id )
  end

  def get_version_number
      @version_number ||= document.set_version_number
  end

  def create_container_version
    section_text.parent_version_number = get_version_number
    section_text.paper_trail.touch_with_version
    self.paper_trail.touch_with_version
  end

end
