class AddChargePlanIdToUsers < ActiveRecord::Migration[5.1]
  def up
    add_column :users, :charge_plan_id, :integer
  end

  def down
    remove_column :users, :charge_plan_id
  end
end
