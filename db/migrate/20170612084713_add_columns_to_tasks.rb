class AddColumnsToTasks < ActiveRecord::Migration[5.1]
  def change
  	add_column :tasks, :logo, :string
  	add_column :tasks, :subtitle, :string
  	add_column :tasks, :show_contents, :boolean
  end
end
