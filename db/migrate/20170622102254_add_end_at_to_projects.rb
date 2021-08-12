class AddEndAtToProjects < ActiveRecord::Migration[5.1]
  def change
  	add_column :projects, :end_at, :datetime
  end
end
