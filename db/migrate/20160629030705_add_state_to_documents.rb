class AddStateToDocuments < ActiveRecord::Migration[5.1]
  def up
    add_column :documents, :state, :integer, default: 0
  end

  def down
    remove_column :documents, :state
  end
end
