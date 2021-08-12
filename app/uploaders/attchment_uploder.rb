class AttachmentUploader < CarrierWave::Uploader::Base
  include CarrierWave::RMagick
  	

  if Rails.env.production?
    storage :fog
  else
    storage :fog
  end


  def extension_white_list
    %w(jpg jpeg gif png)
  end



  # storage :fog

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "uploads/image/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

end