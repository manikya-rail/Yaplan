class AddNodeToWorkflowTemplateSteps < ActiveRecord::Migration[5.1]
  def change
    add_column :workflow_template_steps, :node, :json
  end
end
