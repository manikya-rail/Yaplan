class CreateImages < ActiveRecord::Migration[5.1]
  def up
    remove_column :documents, :images
    create_table :images do |t|
      t.belongs_to :document
      t.string :image

      t.timestamps null: false
    end
  end

  def down
    add_column :documents, :images, :json
    drop_table :images
  end
end
