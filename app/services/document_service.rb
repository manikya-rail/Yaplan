class DocumentService

  def all_accessible_documents(user:,category: nil)
    doc_ids = user.collaborated_documents.where(collaborations: {is_accepted: true}).select(:id)
    Document.where("tasks.id IN (?) OR tasks.project_id IN(?)", doc_ids, user.collaborated_projects.active.pluck(:id))
  end
  
  def duplicate_document(user:, document:, project:)
    document.duplicate(project: project, created_by: user)
  end

end