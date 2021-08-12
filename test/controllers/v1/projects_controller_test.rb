require 'test_helper'

describe V1::ProjectsController do
  let(:document) { create(:document_with_sections) }
  let(:user) { document.created_by }
  let(:project) { document.project }
  let(:other_project) { create(:other_project) }
  let(:category) { project.category }
  
  before do
    sign_in user
  end
  after do
    reset_sign_in
  end

  describe 'Index' do
    it 'returns project list' do
      other_project
      get :index
      assert_response :success
      assert_not_nil assigns(:projects)
      mash_body.projects.size.must_equal 2
    end

    it 'excludes projects created by other people' do
      other_user = create(:another_user)
      create(:other_project, created_by: other_user)
      get :index
      assert_response :success
      assert_not_nil assigns(:projects)
      mash_body.projects.size.must_equal 1
    end

    it 'excludes the template project' do
      create(:document_template)
      get :index
      assert_response :success
      assert_not_nil assigns(:projects)
      mash_body.projects.size.must_equal 1
    end

    it 'returns projects on index page, with included documents' do
      get :index
      mash_body.projects.size.must_equal 1
      Project.find(mash_body.projects.first.id).documents.first.title.must_equal 'Document Title'
    end
  end

  it 'creates a new project' do
    assert_difference('Project.count') do
      post :create, project: { title: 'My lovely project title', category_id: category.id }
      mash_body.project.title.must_equal 'My lovely project title'
    end
  end

  it 'returns a project with its content properly populated' do
    get :show, id: project
    mash_body.project.title.must_equal 'Project Title'
    Project.find(mash_body.project.id).documents.first.title.must_equal 'Document Title'
  end

  it 'updates the title of the document' do
    new_title = 'New Wonderful Project title'
    put :update, id: project, project: { title: new_title }
    mash_body.project.title.must_equal new_title
  end

  it 'archives a project' do
    get :index
    mash_body.projects.size.must_equal 1 # the one from the user signed in
    delete :destroy, id: project
    get :index
    mash_body.projects.size.must_equal 0
  end
end
