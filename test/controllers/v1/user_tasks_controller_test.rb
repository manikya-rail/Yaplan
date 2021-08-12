require 'test_helper'

class V1::UserTasksControllerTest < ActionController::TestCase

	let(:user) {create(:user)}
	let(:user_task) {create(:user_task)}

	before do
		sign_in user
	end
	after do
		reset_sign_in
	end


	it  "test_index" do
		get :index
		assert_response :success
	end

	it "test_show" do
		get :show,id: user_task 
		assert_response :success
	end

end
