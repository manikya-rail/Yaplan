class AddApproverToDocuments < ActiveRecord::Migration[5.1]
  def up
    add_reference :documents, :approver, references: :users, index: true
    add_foreign_key :documents, :users, column: :approver_id

    Document.reset_column_information
  end

  def down
    remove_column :documents, :approver_id
  end
end
