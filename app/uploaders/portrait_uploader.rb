# encoding: utf-8
class PortraitUploader < CarrierWave::Uploader::Base
  include CarrierWave::RMagick

  if Rails.env.production?
    storage :fog
  else
    storage :file
  end

  def store_dir
    "uploads/portrait/#{model.user_id}"
  end

  process resize_to_fill: [200, 200]
  process convert: 'png'

  def filename
    @name ||= "#{timestamp}-profile.png" if original_filename.present? and super.present?
  end

  def timestamp
    var = :"@#{mounted_as}_timestamp"
    model.instance_variable_get(var) or model.instance_variable_set(var, Time.now.to_i)
  end

  def extension_white_list
    %w(jpg jpeg gif png)
  end
end
