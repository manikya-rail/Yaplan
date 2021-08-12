class AddIndexToForCollaboratorId < ActiveRecord::Migration[5.1]
  def change
  	 add_index :collaborations, :collaborator_id
  end
end
