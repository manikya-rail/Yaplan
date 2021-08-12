class AddIsPublicToTasks < ActiveRecord::Migration[5.1]
  def change
    add_column :tasks, :is_public, :boolean, default: false
  end
end
