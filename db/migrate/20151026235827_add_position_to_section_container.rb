class AddPositionToSectionContainer < ActiveRecord::Migration[5.1]
  def change
    add_column :section_containers, :position, :integer
  end
end
