class AddDescriptionToDocumentsUnlessPresent < ActiveRecord::Migration[5.1]

  unless column_exists? :tasks, :description 
  	add_column :tasks, :description, :text
  end
  
end
