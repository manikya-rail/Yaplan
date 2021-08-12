class AddCreatedByToProjects < ActiveRecord::Migration[5.1]
  def change
    add_reference :projects, :created_by, references: :users, index: true, null: false
    add_foreign_key :projects, :users, column: :created_by_id
  end
end
