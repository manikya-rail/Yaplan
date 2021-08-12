class Attachment < ActiveRecord::Base
  mount_uploader :file_attachment, AttachmentUploader
  belongs_to :attachmentable, polymorphic: true, optional: true
  
  	amoeba do
    	customize(lambda { |original_object,new_object|
      		new_object.file_attachment = original_object.file_attachment.file
    	})
  	end

end
