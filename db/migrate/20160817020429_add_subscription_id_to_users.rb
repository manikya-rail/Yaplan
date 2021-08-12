class AddSubscriptionIdToUsers < ActiveRecord::Migration[5.1]
  def up
    add_column :users, :subscription_id, :string
  end

  def down
    remove :users, :subscription_id
  end
end
