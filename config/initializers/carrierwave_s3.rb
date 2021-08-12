CarrierWave.configure do |config|
  config.fog_provider = 'fog/aws'
  config.fog_credentials = {
    provider:              'AWS',
    aws_access_key_id:     ENV['AWS_KEY_ID'].present? ? ENV['AWS_KEY_ID'] : 'AKIAJDBBBF5A2L6PXSHA',
    aws_secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'].present? ? ENV['AWS_SECRET_ACCESS_KEY'] : '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',
    region:                ENV['AWS_REGION'].present? ? ENV['AWS_REGION'] : 'us-west-2'
  }
  config.fog_directory = ENV['AWS_DIR'].present? ? ENV['AWS_DIR'] : 'grapple-development'
  config.remove_previously_stored_files_after_update = false
end
