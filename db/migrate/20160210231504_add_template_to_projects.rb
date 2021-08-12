class AddTemplateToProjects < ActiveRecord::Migration[5.1]
  def change
    add_column :projects, :template_status, :int
  end
end
