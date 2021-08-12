class AddShowPageNumberColumnToTasks < ActiveRecord::Migration[5.1]
  def change
  	add_column :tasks, :show_page_number, :boolean, default: true
  end
end
