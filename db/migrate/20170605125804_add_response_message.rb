class AddResponseMessage < ActiveRecord::Migration[5.1]
  def change
  	add_column :user_tasks,:response_message, :string
  end
end
