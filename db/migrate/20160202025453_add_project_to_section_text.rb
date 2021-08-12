class AddProjectToSectionText < ActiveRecord::Migration[5.1]
  def change
    add_reference :section_texts, :project, index: true, foreign_key: true, null: false
  end
end
