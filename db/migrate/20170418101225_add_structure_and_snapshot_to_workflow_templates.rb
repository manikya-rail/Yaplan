class AddStructureAndSnapshotToWorkflowTemplates < ActiveRecord::Migration[5.1]
  def change
    add_column :workflow_templates, :structure, :json
    add_column :workflow_templates, :snapshot, :string
  end
end
