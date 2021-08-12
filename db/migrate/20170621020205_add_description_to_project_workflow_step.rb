class AddDescriptionToProjectWorkflowStep < ActiveRecord::Migration[5.1]
  def change
    add_column :project_workflow_steps, :description, :text
  end
end
