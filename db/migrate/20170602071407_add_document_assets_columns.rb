class AddDocumentAssetsColumns < ActiveRecord::Migration[5.1]
  def change
  	  	add_column :tasks, :cover_page, :string
  	  	add_column :tasks, :header, :string
  	  	add_column :tasks, :footer, :string

  end
end
