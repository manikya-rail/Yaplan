require 'test_helper'

describe V1::DocumentsController do
  # glet(:user) { create(:user) }
  let(:document) { create(:document_with_sections) } # , created_by: user.id) }
  # let(:document) { create(:document)} #, created_by: user.id) }
  let(:user) { document.created_by }
  let(:other_project) { create(:other_project) }

  before do
    sign_in user
  end
  after do
    reset_sign_in
  end

  it 'returns documents on index page, with deep serialization' do
    get :index
    assert_response :success
    assert_not_nil assigns(:documents)
    json_body['documents'][0]["title"].must_equal document.title
 end

  it 'returns all documents, regardless of project' do
    1.upto(5).each { create(:document_with_sections) }
    1.upto(2).each { create(:document_with_sections, project: other_project) }
    get :index
    mash_body.documents.size.must_equal (5 + 2 + 1) # 5+2 we created, plus the one from the user signed in
  end

  it 'does not return documents from the templates or other users' do
    create(:unrelated_document)
    create(:document, archived: true)
    create(:document_template)
    get :index
    mash_body.documents.size.must_equal 1 # the one from the user signed in
  end

  it 'returns all documents of the project' do
    1.upto(5).each { create(:document_with_sections) }
    1.upto(2).each { create(:document_with_sections, project: other_project) }
    get :index, project_id: document.project_id, format: :json
    mash_body.documents.size.must_equal (5 + 1) # 5 we created, plus the one from the user signed in
  end

  it 'creates a new document' do
    project = create(:project)
    assert_difference('Document.count') do
      post :create, document: { title: 'My lovely document title', project_id: project.id }
    end
  end

  it 'creates a new document and attaches it to its project' do
    project = create(:project)
    assert_difference('Document.count') do
      post :create, document: { title: 'My lovely document title', project_id: project.id }
    end
    Document.last.project.must_equal project
  end

  it 'creates a new document from a template and attaches it to its project' do
    project = create(:project)
    document_template = create(:document_template, title: 'Wonderful name')
    assert_difference('Document.count') do
      post :create, document: { duplicate_from_id: document_template.id, project_id: project.id }
      mash_body.document.title.must_equal 'Wonderful name'
      mash_body.document.id.wont_equal document_template.id
    end
    Document.last.project.must_equal project
  end

  it 'returns a document with its content properly populated' do
    # puts "From test: Current User is #{user}"
    get :show, id: document
    json_body['document']['section_containers'][0]['section_text']['title'].must_equal document.section_containers[0].section_text.title
  end

  it 'updates the title of the document' do
    new_title = 'Wonderful title'
    put :update, id: document, document: { title: new_title }
    assert_response :success
    json_body['document']['title'].must_equal new_title
  end

  it 'deletes a document, removing the section containers but not the section text themselves' do
    document # Instantiate it first
    assert_difference('Document.count', -1) do
      assert_difference('SectionContainer.count', -2) do
        assert_difference('SectionText.count', 0) do
          delete :destroy_for_good, id: document
        end
      end
    end
  end

  it 'archives a document' do
    get :index
    mash_body.documents.size.must_equal 1 # the one from the user signed in
    delete :destroy, id: document
    get :index
    mash_body.documents.size.must_equal 0
  end
end
