class AddCreatedByToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_reference :documents, :created_by, references: :users, index: true
    add_foreign_key :documents, :users, column: :created_by_id
  end
end
