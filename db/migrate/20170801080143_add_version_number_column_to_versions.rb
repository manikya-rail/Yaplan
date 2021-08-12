class AddVersionNumberColumnToVersions < ActiveRecord::Migration[5.1]
  def change
  	add_column :versions, :version_number, :integer
  end
end
