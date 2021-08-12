class AttachmentSerializer < ActiveModel::Serializer
  attributes :id, :attachmentable, :file_attachment
  belongs_to :attachmentable
end
