class CreateChargePlans < ActiveRecord::Migration[5.1]
  def change
    create_table :charge_plans do |t|
      t.string :name
      t.string :code
      t.float :amount
      t.integer :project_count, default: -1
      t.string :currency
      t.string :interval
    end
  end
end
