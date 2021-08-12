class RemoveJoinTableCommunicationRecepientsAndRecepientsEmailColumnToCommunications < ActiveRecord::Migration[5.1]
  def change
  	drop_table :communication_recipients
  	add_column :communications,:recepient_emails,:string,array: true, default: []
  end
end
