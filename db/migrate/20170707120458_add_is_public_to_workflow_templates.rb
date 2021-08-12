class AddIsPublicToWorkflowTemplates < ActiveRecord::Migration[5.1]
  def change
    add_column :workflow_templates, :is_public, :boolean
  end
end
