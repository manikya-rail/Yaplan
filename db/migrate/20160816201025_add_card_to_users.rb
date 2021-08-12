class AddCardToUsers < ActiveRecord::Migration[5.1]
  def up
    add_column :users, :card, :string
  end

  def down
    remove :users, :card
  end
end
