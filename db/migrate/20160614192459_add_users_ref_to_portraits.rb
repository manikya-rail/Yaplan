class AddUsersRefToPortraits < ActiveRecord::Migration[5.1]
  def change
    add_reference :portraits, :user, references: :users, index: true
    add_foreign_key :portraits, :users, column: :user_id
  end
end
