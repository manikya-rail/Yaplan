class AddDescriptionToWorkflowTemplateSteps < ActiveRecord::Migration[5.1]
  def change
    add_column :workflow_template_steps, :description, :text
  end
end
