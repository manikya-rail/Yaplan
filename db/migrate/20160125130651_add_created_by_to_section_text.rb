class AddCreatedByToSectionText < ActiveRecord::Migration[5.1]
  def change
    add_reference :section_texts, :created_by, references: :users, index: true
    add_foreign_key :section_texts, :users, column: :created_by_id
  end
end
