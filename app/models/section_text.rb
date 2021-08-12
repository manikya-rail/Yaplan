class SectionText < ActiveRecord::Base
  attr_accessor :parent_version_number
  has_paper_trail on: [], meta: {
                          version_number: :parent_version_number 
                        }
  DEFAULT_TITLE = 'Section Title'.freeze


  validates :title, presence: true, allow_blank: true
  validates :created_by, presence: true
  validates :project, presence: true

  belongs_to :created_by, class_name: 'User', optional: true
  belongs_to :project, optional: true

  has_many  :section_containers, dependent: :destroy
  has_many  :documents, through: :section_containers

  amoeba do
    nullify :project_id
  end

  def revert_to(version_number: version_num)
    section_text_version = versions.find_by(version_number: version_number)
    update(section_text_version.object.except('created_at','updated_at')) if section_text_version
  end

  private

  # Partial implementation. TODO: update once we know all field elements, what to allow search on
  # Current code below, which gets automatically called by ransack.
  # In other words, currently, we only allow search on combinations of title and content
  def self.ransackable_attributes(scope = :restricted)
    if scope == :all
      # search on all attributes
      super
    else
      # search only the title
      super & %w(title content)
    end
  end


end
