require 'test_helper'

class V1::CommentsControllerTest < ActionController::TestCase
  let(:user) { create(:user) }
  let(:project) { create(:project) }
  let(:document) { create(:document) }

  before do
    sign_in user
  end
  after do
    reset_sign_in
  end

  def project
    @project ||= create(:project)
  end

  def document
    @document ||= create(:document)
  end

  it 'get projects comments with url' do
    get :index, project_id: project.id
    assert_response 200
  end

  it 'get documents comments with url' do
    get :index, document_id: document.id
    assert_response 200
  end

  it 'should create comment for project' do
    @project = create(:project)
    assert_difference('Comment.count') do
      post :create, project_id: project.id, comment: { comment_text: 'Comment 1' }
    end
  end

  it 'should create comment for document' do
    document = create(:document)
    assert_difference('Comment.count') do
      post :create, document_id: document.id, comment: { comment_text: 'Comment 1' }
    end
  end

  it 'should not create empty comment' do
    post :create, project_id: project.id, comment: { comment_text: 'Comment 1' }
    assert_response 201
  end

  it 'should create comment with specific url - document ' do
    new_title = 'Comment 1'
    assert_response :success
    post :create, document_id: document.id, comment: { comment_text: new_title }
    json_body['comment']['commentable_id'] = document.id
    json_body['comment']['comment_text'].must_equal new_title
    json_body['comment']['commentable_type'] = document.class.name
  end

  it 'should create comment with specific url - project ' do
    new_title = 'Comment 1'
    post :create, project_id: project.id, comment: { comment_text: new_title }
    assert_response :success
    json_body['comment']['comment_text'].must_equal new_title
    json_body['comment']['commentable_id'] = project.id
    json_body['comment']['commentable_type'] = project.class.name
  end
end
