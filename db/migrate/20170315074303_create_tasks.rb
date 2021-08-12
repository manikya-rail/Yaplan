class CreateTasks < ActiveRecord::Migration[5.1]
  def change
    rename_table :documents, :tasks
    add_column :tasks, :type, :string
    add_column :tasks, :assigned_to_id, :integer, index: true, foreign_key: true
    Task.update_all(type: 'Document')
  end
end
