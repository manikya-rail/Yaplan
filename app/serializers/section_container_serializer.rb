class SectionContainerSerializer < ActiveModel::Serializer
  attributes :id, :created_at, :updated_at, :linked_documents, :document_id
  has_one :section_text
  has_many :comments

  def linked_documents
    documents = object.linked_docs(current_user)
    arr = []
    unless (documents.empty? || documents.include?(nil) )
      documents.each do |doc|
        accessible = doc.can_access?(current_user)
        (arr << { id: doc.id , title: doc.title , accessible: accessible} ) if !(doc == object.document)
      end
    end 
    return arr.empty? ? nil : arr
  end
end

