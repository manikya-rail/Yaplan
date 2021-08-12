class ChangeDefaultOnCollaborationsIsAccepted < ActiveRecord::Migration[5.1]
  def change
  	change_column_default(:collaborations,:is_accepted,nil)
  end
end
