require 'test_helper'

describe PdfDocumentsController do
  let(:document) { create(:document_with_sections) }
  let(:user) { document.created_by }

  before do
    sign_in user
  end
  after do
    reset_sign_in
  end

  it 'display pdf' do
    get :show, id: document.id, format: 'pdf'
    response.headers['Content-Type'] == 'application/pdf'
  end

  it 'generates pdf and display' do
    get :generate, id: document.id
    response.headers['Content-Type'] == 'application/pdf'
  end
end
