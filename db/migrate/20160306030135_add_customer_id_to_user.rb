class AddCustomerIdToUser < ActiveRecord::Migration[5.1]
  def up
    add_column :users, :customer_id, :string
  end

  def down
    add_column :users, :customer_id
  end
end
