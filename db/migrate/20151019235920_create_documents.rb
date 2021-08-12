class CreateDocuments < ActiveRecord::Migration[5.1]
  def change
    create_table :documents do |t|
      t.references  :user, index: true, foreign_key: true
      t.string      :title, null: false
      t.timestamps null: false
    end
    create_table :section_texts do |t|
      t.string :title, null: false
      t.string     :content
      t.timestamps null: false
    end
    create_table :section_containers do |t|
      t.belongs_to  :section_text, index: true, null: false
      t.belongs_to  :document, index: true, null: false
      t.timestamps null: false
    end
  end
end
