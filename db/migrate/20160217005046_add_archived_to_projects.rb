class AddArchivedToProjects < ActiveRecord::Migration[5.1]
  def change
    add_column :projects, :archived, :bool, default: false
  end
end
