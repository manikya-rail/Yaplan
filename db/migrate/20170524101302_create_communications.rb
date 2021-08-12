class CreateCommunications < ActiveRecord::Migration[5.1]
  def change
    create_table :communications do |t|
      t.string  :message
      t.string  :subject
      t.belongs_to :project_workflow_step,  index: true
      t.integer :communication_mode
      t.timestamps null: false
    end
    create_table :communication_recipients do |t|
      t.belongs_to :user, index: true, null: false
      t.belongs_to :communication , index: true, null: false
      t.timestamps null: false
    end	
  end
end
