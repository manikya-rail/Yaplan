class AddArchivedToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_column :documents, :archived, :bool, default: false
  end
end
