class AddInvitedByToCollaboration < ActiveRecord::Migration[5.1]
  def change
    add_column :collaborations, :invited_by_id, :integer
  end
end
