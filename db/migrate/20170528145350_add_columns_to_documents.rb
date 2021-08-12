class AddColumnsToDocuments < ActiveRecord::Migration[5.1]
  def change
  	add_column :tasks, :proposed_startdate, :date
  	add_column :tasks, :proposed_enddate, :date
  end
end