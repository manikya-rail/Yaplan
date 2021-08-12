class CreateUserTasks < ActiveRecord::Migration[5.1]
  def change
    create_table :user_tasks do |t|
      t.belongs_to :user, index: true, foreign_key: true
      t.belongs_to :task, index: true, foreign_key: true
      t.integer :task_type
      t.integer :response_status
      t.timestamps null: false
    end
  end
end
