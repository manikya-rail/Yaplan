class CreateWorkflowTemplateSteps < ActiveRecord::Migration[5.1]
  def change
    enable_extension 'hstore'
    create_table :workflow_template_steps do |t|
      t.integer :step_id
      t.string :node_type
      t.hstore :node
      t.integer :state
      t.belongs_to :workflow_template, index: true, foreign_key: true
      t.integer :parent_step_id
      t.integer :next_step_id
      t.timestamps null: false
    end
  end
end
