class CreateCollaborations < ActiveRecord::Migration[5.1]
  def change
    create_table :collaborations do |t|
      t.references :collaboration_level, polymorphic: true, index: { name: 'index_on_collabration_level' }
      t.integer :collaborator_id
      t.integer :permission_level, default: 0, null: false
      t.boolean :is_accepted, default: false, null: false
      t.timestamps null: false
    end
  end
end
