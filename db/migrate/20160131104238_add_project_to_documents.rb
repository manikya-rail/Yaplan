class AddProjectToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_reference :documents, :project, index: true, foreign_key: true, null: false
  end
end
