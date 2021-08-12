class AddStructureAndSnapshotToProjectWorkflows < ActiveRecord::Migration[5.1]
  def change
    add_column :project_workflows, :structure, :json
    add_column :project_workflows, :snapshot, :string
  end
end
