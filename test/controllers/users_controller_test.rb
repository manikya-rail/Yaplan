require 'test_helper'

class UsersControllerTest < ActionController::TestCase
  let(:user) { create(:user) }
  let(:admin_user) { create(:admin_user) }
  let(:another_user) { create(:another_user) }

  before do
    sign_in user
  end
  after do
    reset_sign_in
  end

  it 'should show user details ' do
    get :show, id: user, format: :json
    assert_response :success
    mash_body.user.full_name.must_equal user.full_name
  end

  it 'Should not permit other user to view profile' do
    get :show, id: another_user, format: :json
    assert_response :forbidden
  end

  it 'should respond with projects' do
    skip
    project = create(:project)
    get :profile
    assert_response :success
    mash_body.user.projects.title
    mash_body.user.projects.title.must_equal project.title
  end

  it "Normal user  can't delete user record" do
    skip
    delete :destroy, id: user
    assert_response :forbidden
  end

  it "Normal user  can't unarchive user record" do
    skip
    put :unarchive, id: user
    assert_response :forbidden
  end
end
