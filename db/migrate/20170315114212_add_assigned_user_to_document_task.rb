class AddAssignedUserToDocumentTask < ActiveRecord::Migration[5.1]
  def change
    Document.all.each do |doc|
      doc.update(assigned_to_id: doc.created_by_id, approver_id: doc.created_by_id)
    end
  end
end
