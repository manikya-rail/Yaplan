class CreatePlan < ActiveRecord::Migration[5.1]
  def change
    create_table :plans do |t|
      t.string :name
      t.float :amount
      t.integer :project_count
    end
  end
end
