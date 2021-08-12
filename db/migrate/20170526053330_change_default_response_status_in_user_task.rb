class ChangeDefaultResponseStatusInUserTask < ActiveRecord::Migration[5.1]
  def change
  	change_column :user_tasks, :response_status, :integer, default: 3
  end
end
