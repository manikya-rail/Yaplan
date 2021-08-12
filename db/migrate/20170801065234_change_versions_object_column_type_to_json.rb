class ChangeVersionsObjectColumnTypeToJson < ActiveRecord::Migration[5.1]
  def up
  	 remove_column :versions, :object
  	 add_column :versions, :object, :json
  	 add_column :versions, :object_changes, :json
  end
end