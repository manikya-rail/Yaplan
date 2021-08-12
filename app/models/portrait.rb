class Portrait < ActiveRecord::Base
  mount_base64_uploader :image, PortraitUploader
  belongs_to :user, optional: true
  validates :image, presence: true
  validates :user, presence: true
end
