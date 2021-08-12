class Image < ActiveRecord::Base
  mount_base64_uploader :image, ImageUploader
  belongs_to :document, optional: true
end
