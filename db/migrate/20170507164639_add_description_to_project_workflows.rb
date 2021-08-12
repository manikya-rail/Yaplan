class AddDescriptionToProjectWorkflows < ActiveRecord::Migration[5.1]
  def change
    add_column :project_workflows, :description, :text
  end
end
