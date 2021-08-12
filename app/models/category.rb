class Category < ActiveRecord::Base
  mount_base64_uploader :image, CategoryUploader
  validates :name, presence: true

  has_many :projects
  has_many :documents, through: :projects
  has_many :workflow_templates
  scope :active, -> { where(is_archived: false) }
  scope :recent, -> { order(updated_at: :desc) }
  scope :published, -> { where(is_published: true) }
  scope :archived, -> { where(is_archived: true) }

  def self.search(search)
    where("name ILIKE ?", "%#{search}%")
  end

  def archive!
    update(is_archived: true)
  end

  def un_archive!
    update(is_archived: false)
  end
end
