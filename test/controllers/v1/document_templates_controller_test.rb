require 'test_helper'

describe V1::DocumentTemplatesController do
  let(:document_template) { create(:document_template) }
  let(:archived_document_template) { create(:document_template, archived: true) }
  let(:user) { document_template.created_by }
  let(:admin_user) { create(:admin_user) }

  before do
    sign_in user
    archived_document_template
  end
  after do
    reset_sign_in
  end

  it 'returns the template' do
    get :show, id: document_template
    json_body['document']['section_containers'][0]['section_text']['title'].must_match /Section \d+ title/
  end

  it 'returns all the templates of that user' do
    id1 = document_template.id
    create(:document)
    id2 = create(:document_template).id
    create(:document_template_from_another_user)
    get :index
    mash_body.documents.size.must_equal 2
    mash_body.documents.collect { |doc| doc['id'] }.sort.must_equal [id1, id2].sort
  end

  it 'creates a new template' do
    get :index
    mash_body.documents.size.must_equal 1
    doc = create(:document_with_sections)
    assert_difference('Document.count') do
      post :create, document_template: { document_id: doc.id }
    end
    get :index
    mash_body.documents.size.must_equal 2
    doc.is_public.must_equal false
  end

  it 'creates a public template if user is admin' do
    document = create(:document)
    doc = TemplateService.new.create_template_from_existing(user: admin_user, document: document)
    doc.is_public.must_equal true
  end

  it 'archives a new template' do
    get :index
    mash_body.documents.size.must_equal 1
    delete :destroy, id: document_template.id
    get :index
    mash_body.documents.size.must_equal 0
  end

  it 'generate template for new user' do
    if user.sign_in_count == 1
      assert_response :success if Document.generate_templates_for(user)
    end
  end
  it 'check creation on the 2nd login' do
    reset_sign_in
    sign_in user
    if user.sign_in_count == 1
      Document.generate_templates_for(user)
    else
      assert_response :success
    end
  end
end
