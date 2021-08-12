class RemoveUserIdInDocument < ActiveRecord::Migration[5.1]
  def up
    remove_column :documents, :user_id
  end

  def down
    add_column :documents, :user_id, :integer
  end
end
