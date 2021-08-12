class AddDescriptionToWorkflowTemplates < ActiveRecord::Migration[5.1]
  def change
    add_column :workflow_templates, :description, :text
  end
end
