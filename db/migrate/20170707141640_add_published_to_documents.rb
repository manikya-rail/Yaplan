class AddPublishedToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_column :tasks, :published, :boolean, default: false
  end
end
