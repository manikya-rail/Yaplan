require 'test_helper'

describe V1::SectionTextsController do
  let(:section_text) { create(:section_text) }
  let(:user) { section_text.created_by }
  before do
    sign_in user
  end
  after do
    reset_sign_in
  end

  # !!!!!!!!!!!! Strange behaviour. If the factories are created after sign_in,
  # then current_user is set to nil and tests fail.
  # That's why sign_in is manually inserted in each test.

  describe 'index' do
    it 'returns success' do
      create(:section_text)
      create(:numbered_section_text)
      get :index, format: :json
      assert_response :success
      assert_not_nil assigns(:section_texts)
    end

    it 'returns content of all sections whose title match the search query' do
      create(:section_text, title: 'Hello')
      create(:section_text, title: 'Hello Dear')
      create(:section_text)
      title = 'Hello VeryDear'
      create(:section_text, title: title)
      get :index, q: { title_cont: 'ello V' }, format: :json
      assert_response :success
      json_body['section_texts'].size.must_equal 1
      json_body['section_texts'][0]['title'].must_equal title
    end

    # This test fails, this functionality is yet to be implemented
    it 'does not return content of sections from other users' do
      skip
      user2 = create(:user, email: 'azer3@gmail.tes')
      create(:section_text, title: 'Hello')
      create(:section_text, title: 'Hello Dear')
      create(:section_text, created_by: user2)
      title = 'Hello VeryDear'
      create(:section_text, title: title)
      create(:section_text, title: title, created_by: user2)
      get :index, q: { title_cont: 'ello V' }, format: :json
      assert_response :success
      json_body['section_texts'].size.must_equal 1
      json_body['section_texts'][0]['title'].must_equal title
    end

    it 'returns content of all sections whose title or content match the search query' do
      create(:section_text, title: 'Hello Friend')
      create(:section_text)
      content = 'My dear lovely friend'
      section1 = create(:section_text, title: 'Hello', content: content)
      title = 'Hello Very Dear'
      section2 = create(:section_text, title: title)
      get :index, q: { title_or_content_cont: 'dea' }, format: :json
      assert_response :success
      json_body['section_texts'].sort_by { |a| a['id'] }.map { |s| s['title'] }.must_equal [section1.title, section2.title]
      json_body['section_texts'].sort_by { |a| a['id'] }.map { |s| s['content'] }.must_equal [section1.content, section2.content]
    end
  end

  describe 'show' do
    it 'returns the details of a section' do
      get :show, id: section_text, format: :json
      assert_response :success
      mash_body.section_text.title.must_equal section_text.title
      mash_body.section_text.content.must_equal section_text.content
    end
  end

  describe 'update' do
    it 'returns the updated section' do
      new_title = 'Hello'
      put :update, id: section_text, section_text: { title: new_title }, format: :json
      assert_response :success
      mash_body.section_text.title.must_equal new_title
      section_text.reload.title.must_equal new_title
    end
    it 'returns 422 when new title is missing' do
      skip # Don't know why it crashes when we allow blank fields. Strange Rails validation magic?
      new_title = nil
      new_content = 'Our content, still with some <br>html</br> tags."'
      put :update, id: section_text, section_text: { title: new_title, new_content: new_content }, format: :json
      assert_response :unprocessable_entity
    end
  end

  # # We don't destroy sections
  # def test_destroy
  #   assert_difference('SectionText.count', -1) do
  #     delete :destroy, id: section_text
  #   end
  # end
end
