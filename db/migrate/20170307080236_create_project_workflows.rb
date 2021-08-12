class CreateProjectWorkflows < ActiveRecord::Migration[5.1]
  def change
    create_table :project_workflows do |t|
      t.belongs_to :project, index: true, foreign_key: true
      t.belongs_to :workflow_template, index: true, foreign_key: true
      t.boolean :locked, default: false, null: false
      t.string :name
      t.timestamps null: false
    end
  end
end
