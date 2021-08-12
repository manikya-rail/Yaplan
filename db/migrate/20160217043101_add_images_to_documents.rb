class AddImagesToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_column :documents, :images, :json
  end
end
