class AllowNullOnCollaborationsIsAccepted < ActiveRecord::Migration[5.1]
  def change
  	change_column :collaborations, :is_accepted, :boolean, null: true
  end
end
