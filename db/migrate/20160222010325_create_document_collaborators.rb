class CreateDocumentCollaborators < ActiveRecord::Migration[5.1]
  def change
    create_table :document_collaborators, id: false do |t|
      t.references :document
      t.references :user
    end
    # add_index :document_collaborators, [:document_id, :user_id]
    # add_index :document_collaborators, :user_id
  end

  def down
    drop_table :document_collaborators
  end
end
