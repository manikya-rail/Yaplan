class CreateProjectWorkflowSteps < ActiveRecord::Migration[5.1]
  def change
    enable_extension 'hstore'
    create_table :project_workflow_steps do |t|
      t.integer :step_id
      t.string :node_type
      t.hstore :node
      t.references :project_workflow, index: true, foreign_key: true
      t.integer :state, default: 0, null: false
      t.integer :parent_step_id
      t.integer :next_step_id
      t.timestamps null: false
    end
  end
end
