class AddInvitationColumnsToUser < ActiveRecord::Migration[5.1]
  def up
    add_column :users, :invitation_token, :string
    add_column :users, :invitation_created_at, :datetime
    add_column :users, :invitation_sent_at, :datetime
    add_column :users, :invitation_accepted_at, :datetime
    add_column :users, :invitation_limit, :integer
    add_column :users, :invited_by_id, :integer
    add_column :users, :invited_by_type, :string
    add_index :users, :invitation_token, unique: true

    # Allow null encrypted_password
    change_column :users, :encrypted_password, :string, null: true
  end

  def down
    change_column :users, :encrypted_password, :string, null: false, default: ''
    change_column :users, :password_salt, :string, null: false, default: ''

    remove_index :users, :invitation_token
    remove_column :users, :invitation_token
    remove_column :users, :invitation_created_at
    remove_column :users, :invitation_sent_at
    remove_column :users, :invitation_accepted_at
    remove_column :users, :invitation_limit
    remove_column :users, :invited_by_id
    remove_column :users, :invited_by_type
  end
end
