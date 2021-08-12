class CreateWorkflowTemplates < ActiveRecord::Migration[5.1]
  def change
    create_table :workflow_templates do |t|
      t.string :name
      t.boolean :published, default: false
      t.boolean :archived, default: false
      t.belongs_to :category, index: true, foreign_key: true
      t.belongs_to :created_by
      t.timestamps null: false
    end
  end
end
