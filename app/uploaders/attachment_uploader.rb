class AttachmentUploader < CarrierWave::Uploader::Base
  include CarrierWave::RMagick
  
  storage :fog

  def extension_white_list
    %w(jpg jpeg gif png pdf text)
  end


  def serializable_hash(options = {})
    super(options).merge(name: (file.nil? ? "" : file.filename))
  end
  # storage :fog

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "uploads/attachments/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

end