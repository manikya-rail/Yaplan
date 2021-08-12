class AddUniqueIndexToDocumentCollaborators < ActiveRecord::Migration[5.1]
  def up
    add_index :document_collaborators, [:document_id, :user_id], unique: true, name: :no_duplicacy_document_collaborator
  end

  def down
    remove_index :document_collaborators, name: :no_duplicacy_document_collaborator
  end
end
