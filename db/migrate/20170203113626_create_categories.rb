class CreateCategories < ActiveRecord::Migration[5.1]
  def change
    create_table :categories do |t|
      t.string :name
      t.string :image
      t.boolean :is_archived, default: false
      t.boolean :is_published, default: false
      t.timestamps null: false
    end
  end
end
