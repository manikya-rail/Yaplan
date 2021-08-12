class AddShowCoverToTasks < ActiveRecord::Migration[5.1]
  def change
  	add_column :tasks, :show_cover, :boolean
  end
end
